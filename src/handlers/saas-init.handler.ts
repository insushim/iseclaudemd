/**
 * SaaS Init Handler Module
 * SaaS 프로젝트 초기화 로직을 처리하는 핸들러
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import type { SaasInitArgs } from '../types.js';

const execAsync = promisify(exec);

export async function handleSaasInit(args: SaasInitArgs): Promise<string> {
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
      } catch {
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
