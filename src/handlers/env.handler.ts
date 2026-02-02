/**
 * Environment Validation Handler Module
 * 환경 변수 검증 로직을 처리하는 핸들러
 */

import * as fs from 'fs';
import * as path from 'path';
import type { EnvValidateArgs } from '../types.js';

export async function handleEnvValidate(args: EnvValidateArgs): Promise<string> {
  const { projectPath, type = 'all' } = args;

  const envPath = path.join(projectPath, '.env');
  const envExamplePath = path.join(projectPath, '.env.example');

  const results: string[] = [];

  // .env 파일 존재 확인
  if (!fs.existsSync(envPath)) {
    results.push('❌ .env 파일이 없습니다.');

    if (fs.existsSync(envExamplePath)) {
      results.push('💡 .env.example 파일을 .env로 복사하세요:');
      results.push('   cp .env.example .env');
    }
    return results.join('\n');
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const envVars: Record<string, string> = {};

  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      envVars[match[1].trim()] = match[2].trim();
    }
  });

  results.push('📋 환경 변수 검증 결과:\n');

  // NextAuth 검증
  if (type === 'all' || type === 'nextauth') {
    results.push('🔐 NextAuth:');
    const nextauthVars = ['NEXTAUTH_SECRET', 'NEXTAUTH_URL'];
    nextauthVars.forEach(v => {
      if (envVars[v]) {
        results.push(`  ✅ ${v}`);
      } else {
        results.push(`  ❌ ${v} - 누락`);
      }
    });
  }

  // Stripe 검증
  if (type === 'all' || type === 'stripe') {
    results.push('\n💳 Stripe:');
    const stripeVars = ['STRIPE_SECRET_KEY', 'STRIPE_PUBLISHABLE_KEY', 'STRIPE_WEBHOOK_SECRET'];
    stripeVars.forEach(v => {
      if (envVars[v]) {
        const prefix = v.includes('SECRET') ? envVars[v].substring(0, 8) + '...' : envVars[v].substring(0, 12) + '...';
        results.push(`  ✅ ${v} (${prefix})`);
      } else {
        results.push(`  ❌ ${v} - 누락`);
      }
    });
  }

  // Supabase 검증
  if (type === 'all' || type === 'supabase') {
    results.push('\n🗄️ Supabase:');
    const supabaseVars = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'];
    supabaseVars.forEach(v => {
      if (envVars[v]) {
        results.push(`  ✅ ${v}`);
      } else {
        results.push(`  ⚠️ ${v} - 누락 (Supabase 미사용 시 무시)`);
      }
    });
  }

  // Database 검증
  results.push('\n🗃️ Database:');
  if (envVars['DATABASE_URL']) {
    const dbUrl = envVars['DATABASE_URL'];
    if (dbUrl.includes('postgresql://')) {
      results.push('  ✅ DATABASE_URL (PostgreSQL)');
    } else if (dbUrl.includes('mysql://')) {
      results.push('  ✅ DATABASE_URL (MySQL)');
    } else {
      results.push('  ⚠️ DATABASE_URL (알 수 없는 형식)');
    }
  } else {
    results.push('  ❌ DATABASE_URL - 누락');
  }

  return results.join('\n');
}
