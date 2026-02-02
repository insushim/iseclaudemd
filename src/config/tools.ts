/**
 * Tools Configuration Module
 * MCP 도구 정의 모음
 */

export const TOOLS = [
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
