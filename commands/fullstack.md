---
description: 풀스택 프로젝트를 EPCT 워크플로우 + 병렬 처리로 생성합니다
---

# 🏗️ 풀스택 프로젝트 생성: $ARGUMENTS

> **EPCT + 병렬 처리 + 자동 에셋 생성**

## 1️⃣ EXPAND (요구사항 분석)

프로젝트 타입에 따른 핵심 기능을 분석합니다.

## 2️⃣ PLAN (병렬 작업 계획)

### Phase 1: 초기 설정 (순차)
```bash
npx create-next-app@latest $ARGUMENTS --typescript --tailwind --eslint --app --src-dir
cd $ARGUMENTS
```

### Phase 2: 의존성 설치 (🔀 6개 동시)
```bash
# 터미널 1-6에서 동시 실행
npm install zustand @tanstack/react-query
npm install react-hook-form @hookform/resolvers zod
npm install prisma @prisma/client
npm install next-auth@beta
npm install framer-motion next-themes lucide-react
npx shadcn@latest init -y
```

### Phase 3: shadcn 컴포넌트
```bash
npx shadcn@latest add button card input label dialog form toast tabs
```

## 3️⃣ CODE (생성)

### 자동 생성 파일
- `app/icon.tsx` - 파비콘
- `app/opengraph-image.tsx` - OG 이미지
- `lib/prisma.ts` - Prisma 클라이언트
- `lib/auth.ts` - 인증 설정
- `components/ui/*` - UI 컴포넌트

## 4️⃣ TEST (검증)

```bash
npx tsc --noEmit
npm run lint
npm run build
npm run dev
```

## ✅ 체크리스트

- [ ] TypeScript 에러 0개
- [ ] ESLint 에러 0개
- [ ] 빌드 성공
- [ ] 파비콘 표시
- [ ] OG 이미지 확인
- [ ] TODO/FIXME 없음

## 🚀 자동 배포 (선택)

```bash
vercel --prod
```
