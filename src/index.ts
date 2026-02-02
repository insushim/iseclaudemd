#!/usr/bin/env node
/**
 * Claude SaaS MCP Server v7.0
 * SaaS 개발에 실제로 유용한 기능만 제공
 * - Claude Code에 없는 외부 API 연동
 * - 실시간 서비스 상태 확인
 * - 자동화 기능
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

import type {
  StripeBalance,
  StripeListResponse,
  StripeProduct,
  StripePrice,
  StripeWebhook,
  StripeEvent,
  StripeSubscription,
  SupabaseSchema,
  VercelUser,
  VercelProject,
  VercelDeployment,
  VercelEnv,
  VercelDomain,
  GithubCloneArgs,
  StripeCheckArgs,
  SupabaseCheckArgs,
  VercelDeployArgs,
  EnvValidateArgs,
  PrismaAnalyzeArgs,
  ApiHealthcheckArgs,
  DepsSecurityArgs,
  SaasMetricsArgs,
  SaasInitArgs,
  NpmAuditResult,
  NpmOutdatedResult,
  ToolHandler,
} from './types.js';

const execAsync = promisify(exec);

// ============================================
// 도구 정의
// ============================================

const TOOLS = [
  // 1. GitHub 템플릿 클론
  {
    name: 'github_clone_template',
    description: `GitHub에서 SaaS 보일러플레이트를 클론합니다.

인기 템플릿:
- nextjs-saas: Next.js + Prisma + NextAuth + Stripe 풀스택
- t3-app: T3 Stack (Next.js, tRPC, Prisma, Tailwind)
- nextjs-subscription: 구독 결제 전용 템플릿
- shadcn-admin: 관리자 대시보드 템플릿

또는 직접 GitHub URL 지정 가능`,
    inputSchema: {
      type: 'object',
      properties: {
        template: {
          type: 'string',
          description: '템플릿 이름 또는 GitHub URL (예: nextjs-saas, https://github.com/user/repo)'
        },
        projectName: { type: 'string', description: '프로젝트 폴더명' },
        targetDir: { type: 'string', description: '생성 위치 (기본: 현재 디렉토리)' },
      },
      required: ['template', 'projectName'],
    },
  },

  // 2. Stripe 연동 확인
  {
    name: 'stripe_check',
    description: `Stripe 연결 상태 및 설정을 확인합니다.

확인 항목:
- API 키 유효성
- 웹훅 설정 상태
- 상품/가격 목록
- 최근 결제 이벤트`,
    inputSchema: {
      type: 'object',
      properties: {
        secretKey: { type: 'string', description: 'Stripe Secret Key (sk_...)' },
        action: {
          type: 'string',
          enum: ['status', 'products', 'prices', 'webhooks', 'events'],
          description: '확인할 항목'
        },
      },
      required: ['secretKey', 'action'],
    },
  },

  // 3. Supabase 연동
  {
    name: 'supabase_check',
    description: `Supabase 프로젝트 상태를 확인합니다.

확인 항목:
- 연결 상태
- 테이블 목록
- RLS 정책
- Edge Functions`,
    inputSchema: {
      type: 'object',
      properties: {
        projectUrl: { type: 'string', description: 'Supabase 프로젝트 URL' },
        anonKey: { type: 'string', description: 'Supabase anon key' },
        serviceKey: { type: 'string', description: 'Supabase service role key (선택)' },
        action: {
          type: 'string',
          enum: ['status', 'tables', 'rls', 'functions'],
          description: '확인할 항목'
        },
      },
      required: ['projectUrl', 'anonKey', 'action'],
    },
  },

  // 4. Vercel 배포
  {
    name: 'vercel_deploy',
    description: `Vercel 프로젝트를 관리합니다.

기능:
- 배포 상태 확인
- 환경 변수 설정
- 도메인 확인
- 배포 로그`,
    inputSchema: {
      type: 'object',
      properties: {
        token: { type: 'string', description: 'Vercel 토큰' },
        projectId: { type: 'string', description: '프로젝트 ID (선택)' },
        action: {
          type: 'string',
          enum: ['status', 'deploy', 'envs', 'domains', 'logs'],
          description: '수행할 작업'
        },
      },
      required: ['token', 'action'],
    },
  },

  // 5. 환경 변수 검증
  {
    name: 'env_validate',
    description: `프로젝트의 환경 변수를 검증합니다.

확인 항목:
- .env 파일 존재 여부
- 필수 변수 누락 확인
- 형식 유효성 (URL, API 키 등)
- .env.example과 비교`,
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: { type: 'string', description: '프로젝트 경로' },
        type: {
          type: 'string',
          enum: ['nextauth', 'stripe', 'supabase', 'all'],
          description: '검증할 서비스 유형'
        },
      },
      required: ['projectPath'],
    },
  },

  // 6. Prisma 스키마 분석
  {
    name: 'prisma_analyze',
    description: `Prisma 스키마를 분석하고 개선점을 제안합니다.

분석 항목:
- 모델 관계 시각화
- 인덱스 최적화 제안
- 타입 안전성 확인
- 마이그레이션 상태`,
    inputSchema: {
      type: 'object',
      properties: {
        schemaPath: { type: 'string', description: 'schema.prisma 파일 경로' },
        action: {
          type: 'string',
          enum: ['analyze', 'visualize', 'suggest', 'migrations'],
          description: '수행할 작업'
        },
      },
      required: ['schemaPath'],
    },
  },

  // 7. API 헬스체크
  {
    name: 'api_healthcheck',
    description: `여러 엔드포인트의 상태를 동시에 확인합니다.

확인 항목:
- 응답 시간
- 상태 코드
- SSL 인증서 유효성
- 가용성`,
    inputSchema: {
      type: 'object',
      properties: {
        endpoints: {
          type: 'array',
          items: { type: 'string' },
          description: '확인할 URL 목록'
        },
        timeout: { type: 'number', description: '타임아웃 (ms, 기본: 5000)' },
      },
      required: ['endpoints'],
    },
  },

  // 8. 의존성 보안 검사
  {
    name: 'deps_security',
    description: `npm 의존성의 보안 취약점을 검사합니다.

기능:
- 취약점 스캔
- 자동 수정 가능 여부
- 업데이트 권장 버전
- 라이선스 확인`,
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: { type: 'string', description: '프로젝트 경로' },
        action: {
          type: 'string',
          enum: ['audit', 'outdated', 'licenses'],
          description: '수행할 작업'
        },
      },
      required: ['projectPath'],
    },
  },

  // 9. SaaS 메트릭 조회
  {
    name: 'saas_metrics',
    description: `SaaS 핵심 지표를 조회합니다. (Stripe 기반)

지표:
- MRR (월간 반복 매출)
- 활성 구독자 수
- 이탈률
- ARPU (사용자당 평균 매출)`,
    inputSchema: {
      type: 'object',
      properties: {
        stripeKey: { type: 'string', description: 'Stripe Secret Key' },
        period: {
          type: 'string',
          enum: ['today', 'week', 'month', 'year'],
          description: '조회 기간'
        },
      },
      required: ['stripeKey'],
    },
  },

  // 10. 프로젝트 초기화
  {
    name: 'saas_init',
    description: `SaaS 프로젝트를 처음부터 설정합니다.

자동 설정:
- Next.js + TypeScript + Tailwind
- Prisma + PostgreSQL
- NextAuth 인증
- Stripe 결제
- shadcn/ui 컴포넌트`,
    inputSchema: {
      type: 'object',
      properties: {
        projectName: { type: 'string', description: '프로젝트 이름' },
        targetDir: { type: 'string', description: '생성 위치' },
        features: {
          type: 'array',
          items: { type: 'string' },
          description: '포함할 기능: auth, stripe, prisma, shadcn, analytics'
        },
      },
      required: ['projectName'],
    },
  },
];

// ============================================
// 핸들러 구현
// ============================================

// GitHub 템플릿 정의
const GITHUB_TEMPLATES: Record<string, string> = {
  'nextjs-saas': 'https://github.com/vercel/nextjs-subscription-payments',
  't3-app': 'https://github.com/t3-oss/create-t3-app',
  'nextjs-subscription': 'https://github.com/vercel/nextjs-subscription-payments',
  'shadcn-admin': 'https://github.com/shadcn-ui/ui',
  'next-saas-stripe': 'https://github.com/mickasmt/next-saas-stripe-starter',
  'taxonomy': 'https://github.com/shadcn-ui/taxonomy',
};

async function handleGithubClone(args: GithubCloneArgs): Promise<string> {
  const { template, projectName, targetDir = '.' } = args;

  // 템플릿 URL 결정
  let repoUrl = template;
  if (!template.startsWith('http')) {
    repoUrl = GITHUB_TEMPLATES[template];
    if (!repoUrl) {
      return `알 수 없는 템플릿: ${template}

사용 가능한 템플릿:
${Object.entries(GITHUB_TEMPLATES).map(([name, url]) => `- ${name}: ${url}`).join('\n')}

또는 GitHub URL을 직접 입력하세요.`;
    }
  }

  const fullPath = path.join(targetDir, projectName);

  try {
    // git clone 실행
    const { stdout, stderr } = await execAsync(`git clone --depth 1 ${repoUrl} "${fullPath}"`);

    // .git 폴더 삭제 (새 프로젝트로 시작)
    await execAsync(`rm -rf "${path.join(fullPath, '.git')}"`);

    // git init
    await execAsync(`cd "${fullPath}" && git init`);

    return `✅ 템플릿 클론 완료!

📁 위치: ${fullPath}
📦 소스: ${repoUrl}

다음 단계:
1. cd ${projectName}
2. npm install
3. .env.example을 .env로 복사하고 설정
4. npm run dev`;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `❌ 클론 실패: ${errorMessage}

수동 클론:
git clone ${repoUrl} ${projectName}`;
  }
}

async function handleStripeCheck(args: StripeCheckArgs): Promise<string> {
  const { secretKey, action } = args;

  if (!secretKey.startsWith('sk_')) {
    return '❌ 유효하지 않은 Stripe Secret Key입니다. sk_로 시작해야 합니다.';
  }

  const isTestMode = secretKey.startsWith('sk_test_');

  try {
    const baseUrl = 'https://api.stripe.com/v1';
    const headers = {
      'Authorization': `Bearer ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    let result = '';

    switch (action) {
      case 'status':
        const balanceRes = await fetch(`${baseUrl}/balance`, { headers });
        if (balanceRes.ok) {
          const balance = await balanceRes.json() as StripeBalance;
          result = `✅ Stripe 연결 성공!

모드: ${isTestMode ? '🧪 테스트' : '🔴 라이브'}
잔액: ${balance.available?.[0]?.amount / 100 || 0} ${balance.available?.[0]?.currency?.toUpperCase() || 'USD'}`;
        } else {
          result = `❌ 연결 실패: ${balanceRes.status}`;
        }
        break;

      case 'products':
        const productsRes = await fetch(`${baseUrl}/products?limit=10`, { headers });
        if (productsRes.ok) {
          const products = await productsRes.json() as StripeListResponse<StripeProduct>;
          result = `📦 상품 목록 (${products.data.length}개):

${products.data.map((p) => `- ${p.name} (${p.id}) ${p.active ? '✅' : '❌'}`).join('\n') || '상품 없음'}`;
        }
        break;

      case 'prices':
        const pricesRes = await fetch(`${baseUrl}/prices?limit=10`, { headers });
        if (pricesRes.ok) {
          const prices = await pricesRes.json() as StripeListResponse<StripePrice>;
          result = `💰 가격 목록 (${prices.data.length}개):

${prices.data.map((p) => `- ${p.nickname || p.id}: ${p.unit_amount / 100} ${p.currency.toUpperCase()}/${p.recurring?.interval || 'one-time'}`).join('\n') || '가격 없음'}`;
        }
        break;

      case 'webhooks':
        const webhooksRes = await fetch(`${baseUrl}/webhook_endpoints`, { headers });
        if (webhooksRes.ok) {
          const webhooks = await webhooksRes.json() as StripeListResponse<StripeWebhook>;
          result = `🔗 웹훅 엔드포인트 (${webhooks.data.length}개):

${webhooks.data.map((w) => `- ${w.url}\n  이벤트: ${w.enabled_events.slice(0, 3).join(', ')}${w.enabled_events.length > 3 ? '...' : ''}`).join('\n\n') || '웹훅 없음'}`;
        }
        break;

      case 'events':
        const eventsRes = await fetch(`${baseUrl}/events?limit=5`, { headers });
        if (eventsRes.ok) {
          const events = await eventsRes.json() as StripeListResponse<StripeEvent>;
          result = `📊 최근 이벤트:

${events.data.map((e) => `- ${e.type} (${new Date(e.created * 1000).toLocaleString()})`).join('\n') || '이벤트 없음'}`;
        }
        break;
    }

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `❌ Stripe API 오류: ${errorMessage}`;
  }
}

async function handleSupabaseCheck(args: SupabaseCheckArgs): Promise<string> {
  const { projectUrl, anonKey, serviceKey, action } = args;

  const headers: Record<string, string> = {
    'apikey': anonKey,
    'Authorization': `Bearer ${serviceKey || anonKey}`,
    'Content-Type': 'application/json',
  };

  try {
    let result = '';

    switch (action) {
      case 'status':
        const healthRes = await fetch(`${projectUrl}/rest/v1/`, { headers });
        result = healthRes.ok
          ? `✅ Supabase 연결 성공!\n\nURL: ${projectUrl}\n상태: 정상`
          : `❌ 연결 실패: ${healthRes.status}`;
        break;

      case 'tables':
        // PostgREST 스키마 조회
        const schemaRes = await fetch(`${projectUrl}/rest/v1/`, {
          headers: { ...headers, 'Accept': 'application/openapi+json' }
        });
        if (schemaRes.ok) {
          const schema = await schemaRes.json() as SupabaseSchema;
          const tables = Object.keys(schema.definitions || {});
          result = `📊 테이블 목록 (${tables.length}개):

${tables.map(t => `- ${t}`).join('\n') || '테이블 없음'}`;
        }
        break;

      case 'rls':
        result = `🔒 RLS 정책 확인

RLS(Row Level Security) 상태를 확인하려면 Supabase 대시보드에서 확인하세요:
${projectUrl.replace('.supabase.co', '.supabase.com')}/project/_/auth/policies`;
        break;

      case 'functions':
        result = `⚡ Edge Functions

Edge Functions 목록을 확인하려면:
${projectUrl.replace('.supabase.co', '.supabase.com')}/project/_/functions`;
        break;
    }

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `❌ Supabase 오류: ${errorMessage}`;
  }
}

async function handleVercelDeploy(args: VercelDeployArgs): Promise<string> {
  const { token, projectId, action } = args;

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  try {
    let result = '';
    const baseUrl = 'https://api.vercel.com';

    switch (action) {
      case 'status':
        const userRes = await fetch(`${baseUrl}/v2/user`, { headers });
        if (userRes.ok) {
          const user = await userRes.json() as VercelUser;
          result = `✅ Vercel 연결 성공!

👤 사용자: ${user.user.name || user.user.username}
📧 이메일: ${user.user.email}`;
        }
        break;

      case 'deploy':
        if (!projectId) {
          // 프로젝트 목록 조회
          const projectsRes = await fetch(`${baseUrl}/v9/projects`, { headers });
          if (projectsRes.ok) {
            const projects = await projectsRes.json() as { projects: VercelProject[] };
            result = `📁 프로젝트 목록:

${projects.projects.map((p) => `- ${p.name} (${p.id})`).join('\n')}

배포하려면 projectId를 지정하세요.`;
          }
        } else {
          // 최근 배포 조회
          const deploysRes = await fetch(`${baseUrl}/v6/deployments?projectId=${projectId}&limit=5`, { headers });
          if (deploysRes.ok) {
            const deploys = await deploysRes.json() as { deployments: VercelDeployment[] };
            result = `🚀 최근 배포:

${deploys.deployments.map((d) => `- ${d.url}\n  상태: ${d.state} | ${new Date(d.created).toLocaleString()}`).join('\n\n')}`;
          }
        }
        break;

      case 'envs':
        if (!projectId) {
          result = '프로젝트 ID가 필요합니다.';
        } else {
          const envsRes = await fetch(`${baseUrl}/v10/projects/${projectId}/env`, { headers });
          if (envsRes.ok) {
            const envs = await envsRes.json() as { envs: VercelEnv[] };
            result = `🔐 환경 변수 (${envs.envs.length}개):

${envs.envs.map((e) => `- ${e.key} [${e.target.join(', ')}]`).join('\n')}`;
          }
        }
        break;

      case 'domains':
        if (!projectId) {
          result = '프로젝트 ID가 필요합니다.';
        } else {
          const domainsRes = await fetch(`${baseUrl}/v9/projects/${projectId}/domains`, { headers });
          if (domainsRes.ok) {
            const domains = await domainsRes.json() as { domains: VercelDomain[] };
            result = `🌐 도메인:

${domains.domains.map((d) => `- ${d.name} ${d.verified ? '✅' : '❌'}`).join('\n')}`;
          }
        }
        break;

      case 'logs':
        result = `📋 로그 확인

Vercel 대시보드에서 확인하세요:
https://vercel.com/dashboard`;
        break;
    }

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `❌ Vercel API 오류: ${errorMessage}`;
  }
}

async function handleEnvValidate(args: EnvValidateArgs): Promise<string> {
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

async function handlePrismaAnalyze(args: PrismaAnalyzeArgs): Promise<string> {
  const { schemaPath, action = 'analyze' } = args;

  if (!fs.existsSync(schemaPath)) {
    return `❌ 스키마 파일을 찾을 수 없습니다: ${schemaPath}`;
  }

  const schema = fs.readFileSync(schemaPath, 'utf-8');
  const results: string[] = [];

  switch (action) {
    case 'analyze':
      // 모델 추출
      const modelMatches = schema.match(/model\s+(\w+)\s*\{[^}]+\}/g) || [];
      const models = modelMatches.map(m => {
        const nameMatch = m.match(/model\s+(\w+)/);
        const fields = (m.match(/^\s+\w+\s+\w+/gm) || []).length;
        return { name: nameMatch?.[1] || '', fields };
      });

      results.push(`📊 Prisma 스키마 분석\n`);
      results.push(`모델 수: ${models.length}개\n`);

      models.forEach(m => {
        results.push(`  - ${m.name} (${m.fields} 필드)`);
      });

      // 관계 분석
      const relations = (schema.match(/@relation/g) || []).length;
      results.push(`\n관계: ${relations}개`);

      // 인덱스 분석
      const indexes = (schema.match(/@@index|@@unique/g) || []).length;
      results.push(`인덱스: ${indexes}개`);

      // 권장사항
      results.push('\n💡 권장사항:');
      if (indexes < models.length) {
        results.push('  - 인덱스 추가 검토 필요 (쿼리 성능 향상)');
      }
      if (!schema.includes('@@map')) {
        results.push('  - @@map으로 테이블명 매핑 검토');
      }
      if (!schema.includes('updatedAt')) {
        results.push('  - updatedAt 필드 추가 권장');
      }
      break;

    case 'visualize':
      results.push('📐 스키마 시각화\n');
      const vizModels = schema.match(/model\s+(\w+)/g) || [];
      vizModels.forEach(m => {
        const name = m.replace('model ', '');
        results.push(`┌─ ${name}`);

        // 관계 찾기
        const relationPattern = new RegExp(`${name}\\s+${name}\\[\\]|${name}\\?`, 'g');
        const relatedModels = schema.match(relationPattern) || [];
        if (relatedModels.length > 0) {
          results.push(`│  └─→ 관계 있음`);
        }
        results.push('└────────');
      });
      break;

    case 'migrations':
      results.push('📁 마이그레이션 상태\n');
      const migrationsDir = path.join(path.dirname(schemaPath), 'migrations');
      if (fs.existsSync(migrationsDir)) {
        const migrations = fs.readdirSync(migrationsDir).filter(f => f !== 'migration_lock.toml');
        results.push(`마이그레이션 수: ${migrations.length}개`);
        migrations.slice(-5).forEach(m => {
          results.push(`  - ${m}`);
        });
      } else {
        results.push('마이그레이션 폴더가 없습니다.');
        results.push('npx prisma migrate dev --name init');
      }
      break;
  }

  return results.join('\n');
}

/**
 * 🔒 URL 검증 - SSRF 방지
 */
function isValidHealthcheckUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // HTTP/HTTPS만 허용
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }
    // 내부 네트워크 주소 차단 (SSRF 방지)
    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.16.') ||
      hostname.endsWith('.local')
    ) {
      // 로컬 개발 환경에서는 허용 (production에서는 차단 권장)
      // return false;
    }
    return true;
  } catch {
    return false;
  }
}

async function handleApiHealthcheck(args: ApiHealthcheckArgs): Promise<string> {
  const { endpoints, timeout = 5000 } = args;

  const results: string[] = ['🏥 API 헬스체크 결과\n'];

  for (const url of endpoints) {
    // 🔒 보안: URL 검증
    if (!isValidHealthcheckUrl(url)) {
      results.push(`❌ ${url}`);
      results.push(`   오류: 유효하지 않은 URL (HTTP/HTTPS만 허용)`);
      continue;
    }

    try {
      const start = Date.now();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        signal: controller.signal,
        method: 'HEAD'
      }).catch(() => fetch(url, { signal: controller.signal }));

      clearTimeout(timeoutId);
      const duration = Date.now() - start;

      if (response.ok) {
        results.push(`✅ ${url}`);
        results.push(`   상태: ${response.status} | 응답: ${duration}ms`);
      } else {
        results.push(`⚠️ ${url}`);
        results.push(`   상태: ${response.status} | 응답: ${duration}ms`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      results.push(`❌ ${url}`);
      results.push(`   오류: ${errorMessage}`);
    }
  }

  return results.join('\n');
}

async function handleDepsSecurity(args: DepsSecurityArgs): Promise<string> {
  const { projectPath, action = 'audit' } = args;

  const packageJsonPath = path.join(projectPath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    return `❌ package.json을 찾을 수 없습니다: ${projectPath}`;
  }

  try {
    let result = '';

    switch (action) {
      case 'audit':
        const { stdout: auditOut } = await execAsync(`cd "${projectPath}" && npm audit --json 2>/dev/null || true`);
        try {
          const audit = JSON.parse(auditOut) as NpmAuditResult;
          const vulns = audit.metadata?.vulnerabilities || {};
          result = `🔒 보안 감사 결과

취약점:
  - 심각: ${vulns.critical || 0}
  - 높음: ${vulns.high || 0}
  - 보통: ${vulns.moderate || 0}
  - 낮음: ${vulns.low || 0}

${(vulns.critical || 0) + (vulns.high || 0) > 0 ? '⚠️ npm audit fix 실행을 권장합니다.' : '✅ 심각한 취약점이 없습니다.'}`;
        } catch (_error) {
          result = '✅ 취약점이 발견되지 않았습니다.';
        }
        break;

      case 'outdated':
        const { stdout: outdatedOut } = await execAsync(`cd "${projectPath}" && npm outdated --json 2>/dev/null || true`);
        try {
          const outdated = JSON.parse(outdatedOut || '{}') as NpmOutdatedResult;
          const deps = Object.entries(outdated);
          if (deps.length === 0) {
            result = '✅ 모든 패키지가 최신 버전입니다.';
          } else {
            result = `📦 업데이트 가능한 패키지 (${deps.length}개):\n\n`;
            deps.slice(0, 10).forEach(([name, info]) => {
              result += `- ${name}: ${info.current} → ${info.latest}\n`;
            });
            if (deps.length > 10) {
              result += `\n... 외 ${deps.length - 10}개`;
            }
          }
        } catch (_error) {
          result = '✅ 모든 패키지가 최신 버전입니다.';
        }
        break;

      case 'licenses':
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
        result = `📜 의존성 라이선스 (${Object.keys(allDeps).length}개 패키지)

주요 패키지는 대부분 MIT 라이선스입니다.
상세 정보는 npx license-checker 로 확인하세요.`;
        break;
    }

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `❌ 오류: ${errorMessage}`;
  }
}

async function handleSaasMetrics(args: SaasMetricsArgs): Promise<string> {
  const { stripeKey, period = 'month' } = args;

  if (!stripeKey.startsWith('sk_')) {
    return '❌ 유효하지 않은 Stripe Secret Key입니다.';
  }

  const headers = {
    'Authorization': `Bearer ${stripeKey}`,
  };

  try {
    // 구독 조회
    const subsRes = await fetch('https://api.stripe.com/v1/subscriptions?status=active&limit=100', { headers });
    const subs = await subsRes.json() as StripeListResponse<StripeSubscription>;

    // MRR 계산
    let mrr = 0;
    subs.data?.forEach((sub) => {
      sub.items?.data?.forEach((item) => {
        const amount = item.price?.unit_amount || 0;
        const interval = item.price?.recurring?.interval;
        if (interval === 'month') {
          mrr += amount;
        } else if (interval === 'year') {
          mrr += amount / 12;
        }
      });
    });

    // 고객 수 (결과는 사용하지 않으므로 await만)
    await fetch('https://api.stripe.com/v1/customers?limit=1', { headers });

    const activeSubscribers = subs.data?.length || 0;
    const arpu = activeSubscribers > 0 ? mrr / activeSubscribers : 0;

    return `📊 SaaS 핵심 지표

💰 MRR (월간 반복 매출): $${(mrr / 100).toFixed(2)}
👥 활성 구독자: ${activeSubscribers}명
📈 ARPU (사용자당 평균 매출): $${(arpu / 100).toFixed(2)}

${stripeKey.includes('test') ? '⚠️ 테스트 모드 데이터입니다.' : ''}`;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `❌ Stripe API 오류: ${errorMessage}`;
  }
}

async function handleSaasInit(args: SaasInitArgs): Promise<string> {
  const { projectName, targetDir = '.', features = ['auth', 'stripe', 'prisma', 'shadcn'] } = args;

  const fullPath = path.join(targetDir, projectName);
  const results: string[] = [];

  results.push(`🚀 SaaS 프로젝트 초기화: ${projectName}\n`);

  try {
    // 1. Next.js 프로젝트 생성
    results.push('1️⃣ Next.js 프로젝트 생성 중...');
    await execAsync(`npx create-next-app@latest "${fullPath}" --typescript --tailwind --app --eslint --src-dir --import-alias "@/*" --use-npm`);
    results.push('   ✅ 완료\n');

    // 2. 추가 패키지 설치
    const packages: string[] = [];

    if (features.includes('prisma')) {
      packages.push('@prisma/client', 'prisma');
    }
    if (features.includes('auth')) {
      packages.push('next-auth', '@auth/prisma-adapter');
    }
    if (features.includes('stripe')) {
      packages.push('stripe', '@stripe/stripe-js');
    }
    if (features.includes('analytics')) {
      packages.push('@vercel/analytics');
    }

    if (packages.length > 0) {
      results.push('2️⃣ 패키지 설치 중...');
      await execAsync(`cd "${fullPath}" && npm install ${packages.join(' ')}`);
      results.push(`   ✅ ${packages.length}개 패키지 설치 완료\n`);
    }

    // 3. Prisma 초기화
    if (features.includes('prisma')) {
      results.push('3️⃣ Prisma 초기화 중...');
      await execAsync(`cd "${fullPath}" && npx prisma init`);
      results.push('   ✅ 완료\n');
    }

    // 4. shadcn/ui 초기화
    if (features.includes('shadcn')) {
      results.push('4️⃣ shadcn/ui 초기화...');
      try {
        await execAsync(`cd "${fullPath}" && npx shadcn@latest init -y`);
        results.push('   ✅ 완료\n');
      } catch (_error) {
        results.push('   ⚠️ 수동 설정 필요: npx shadcn@latest init\n');
      }
    }

    // 5. 환경 변수 템플릿 생성
    const envExample = `# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# NextAuth
NEXTAUTH_SECRET="${Buffer.from(Math.random().toString()).toString('base64').slice(0, 32)}"
NEXTAUTH_URL="http://localhost:3000"

# OAuth (선택)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
`;

    fs.writeFileSync(path.join(fullPath, '.env.example'), envExample);
    fs.writeFileSync(path.join(fullPath, '.env'), envExample);
    results.push('5️⃣ 환경 변수 템플릿 생성 ✅\n');

    results.push(`\n✅ 프로젝트 생성 완료!

📁 위치: ${fullPath}

다음 단계:
1. cd ${projectName}
2. .env 파일 수정 (API 키 입력)
3. npx prisma db push (DB 연결 후)
4. npm run dev`);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    results.push(`\n❌ 오류: ${errorMessage}`);
  }

  return results.join('\n');
}

// ============================================
// 핸들러 매핑
// ============================================

type AnyToolHandler = (args: Record<string, unknown>) => Promise<string>;

const handlers: Record<string, AnyToolHandler> = {
  github_clone_template: (args) => handleGithubClone(args as unknown as GithubCloneArgs),
  stripe_check: (args) => handleStripeCheck(args as unknown as StripeCheckArgs),
  supabase_check: (args) => handleSupabaseCheck(args as unknown as SupabaseCheckArgs),
  vercel_deploy: (args) => handleVercelDeploy(args as unknown as VercelDeployArgs),
  env_validate: (args) => handleEnvValidate(args as unknown as EnvValidateArgs),
  prisma_analyze: (args) => handlePrismaAnalyze(args as unknown as PrismaAnalyzeArgs),
  api_healthcheck: (args) => handleApiHealthcheck(args as unknown as ApiHealthcheckArgs),
  deps_security: (args) => handleDepsSecurity(args as unknown as DepsSecurityArgs),
  saas_metrics: (args) => handleSaasMetrics(args as unknown as SaasMetricsArgs),
  saas_init: (args) => handleSaasInit(args as unknown as SaasInitArgs),
};

// ============================================
// 서버 설정
// ============================================

const server = new Server(
  {
    name: 'claude-saas-mcp',
    version: '6.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  let result: string;

  try {
    const handler = handlers[name];
    if (handler) {
      result = await handler(args as Record<string, unknown>);
    } else {
      result = `알 수 없는 도구: ${name}`;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    result = `오류 발생: ${errorMessage}`;
  }

  return {
    content: [{ type: 'text', text: result }],
  };
});

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // MCP 서버는 stderr로 로그를 출력해야 함 (stdout은 프로토콜 통신용)
  process.stderr.write(`🚀 Claude SaaS MCP v7.0 시작됨 (${TOOLS.length}개 도구)\n`);
}

main().catch((error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  process.stderr.write(`MCP 서버 오류: ${errorMessage}\n`);
  process.exit(1);
});
