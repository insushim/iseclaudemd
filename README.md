# 🚀 Claude Ultimate MCP Server v3.0

> **세계 100개 AI 에이전트 장점 통합 + 한국어 자연어 완벽 지원**
> **Claude Code용 완전한 AI 에이전트 시스템**

---

## ✨ 주요 기능

### 🔴 치명적 오류 우선 감지
- 무한 루프, 메모리 누수, 스택 오버플로우 자동 감지
- 발견 시 모든 작업 중단 후 치명적 오류 먼저 수정

### 🎨 세련된 UI 자동 구성
- Cursor, Bolt, Lovable, v0.dev 스타일 통합
- shadcn/ui + Tailwind + Framer Motion

### 📛 SaaS 이름 자동 생성
- 순우리말: 가온빛, 하늘샘, 별빛누리 등
- 세련된 영어: nova, flux, pulse.io 등

### 🎯 파비콘/썸네일 자동 생성
- Next.js ImageResponse API 활용
- 파비콘, OG 이미지, Twitter Card 자동 생성

### 🌐 브라우저 자동 테스트
- Playwright 통합
- 반응형 테스트, 스크린샷, 성능 측정

### 🚀 자동 배포
- Vercel, Netlify, Docker 지원
- 빌드 완료 시 자동 배포 옵션

### 🔀 EPCT + 병렬 처리
- Expand → Plan → Code → Test 워크플로우
- 독립 작업 동시 실행 (40-60% 시간 단축)

### 🤖 서브에이전트 & 스킬
- 연구, 리뷰, 테스트 서브에이전트
- 문서화, 리팩토링, 최적화 스킬

### 🇰🇷 한국어 자연어 1000+ 패턴
- "안돼" → 오류 수정
- "쇼핑몰 만들어줘" → 풀스택 생성

---

## 📦 설치 방법

### 1단계: 패키지 설치

```bash
cd claude-ultimate-mcp-v3
npm install
npm run build
```

### 2단계: Claude Code에 MCP 서버 등록

`~/.claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "claude-ultimate": {
      "command": "node",
      "args": ["/절대경로/claude-ultimate-mcp-v3/dist/index.js"]
    }
  }
}
```

### 3단계: CLAUDE.md 복사

```bash
cp CLAUDE.md /your/project/
```

### 4단계: Claude Code 재시작

---

## 🎯 사용법

### 한국어로 말하기

```
"안돼"              → 치명적 오류 스캔 및 수정
"쇼핑몰 만들어줘"    → 풀스택 프로젝트 생성
"예쁘게 해줘"       → UI 개선
"배포해"            → 자동 배포
```

### MCP 도구 직접 호출

```
critical_first()                    # 치명적 오류 스캔
fullstack_epct(projectType: "saas") # 풀스택 생성
name_generator(domain: "ecommerce") # 이름 생성
asset_generator(projectName: "Nova")# 에셋 생성
browser_test(url: "localhost:3000") # 브라우저 테스트
auto_deploy(platform: "vercel")     # 자동 배포
```

---

## 🛠️ MCP 도구 목록 (30+)

| 도구 | 설명 |
|------|------|
| `korean_natural` | 한국어 자연어 처리 |
| `critical_first` | 치명적 오류 우선 감지 |
| `fullstack_epct` | 풀스택 EPCT 생성 |
| `name_generator` | SaaS 이름 생성 |
| `asset_generator` | 파비콘/OG 생성 |
| `browser_test` | 브라우저 테스트 |
| `auto_deploy` | 자동 배포 |
| `elegant_ui` | 세련된 UI 생성 |
| `fix_epct` | 에러 수정 EPCT |
| `parallel` | 병렬 작업 |
| `subagent_research` | 연구 서브에이전트 |
| `subagent_review` | 리뷰 서브에이전트 |
| `subagent_test` | 테스트 서브에이전트 |
| `skill_docs` | 문서화 스킬 |
| `skill_refactor` | 리팩토링 스킬 |
| `skill_optimize` | 최적화 스킬 |

---

## 🎨 세계 AI 에이전트 장점 통합

| 에이전트 | 통합된 기능 |
|----------|-------------|
| Cursor | 멀티 파일 편집, 코드베이스 이해 |
| Copilot | 자동완성, 코드 제안 |
| Bolt.new | 풀스택 생성, 즉시 배포 |
| Lovable | 12분 MVP, Supabase 통합 |
| v0.dev | 고품질 UI 컴포넌트 |
| Windsurf | Cascade 워크플로우 |
| Devin | 자율 에이전트, 테스트 실행 |
| Claude Code | MCP, 서브에이전트, 스킬 |

---

## 📋 기술 스택

- **프레임워크**: Next.js 15 (App Router)
- **언어**: TypeScript 5.x (strict)
- **스타일**: Tailwind CSS + shadcn/ui
- **애니메이션**: Framer Motion
- **DB**: Prisma + PostgreSQL
- **인증**: NextAuth.js v5
- **결제**: Stripe / 토스페이먼츠
- **테스트**: Playwright, Vitest
- **배포**: Vercel, Docker

---

## 📜 라이선스

MIT
