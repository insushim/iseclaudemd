---
description: OpenCode 스타일 철저한 검증. /deep-sync 또는 "딥싱크", "철저하게", "OpenCode처럼", "꼼꼼하게" 할 때 사용.
---

# Deep Sync Mode - OpenCode 스타일 철저한 검증

> **빠른 것보다 확실한 것** - 5개 에이전트 병렬 실행 + 전체 테스트

이 커맨드를 실행하면 다음을 **순서대로** 진행합니다:

---

## Phase 1: 환경 검증 (병렬)

먼저 다음 4개 명령을 **동시에** 실행하세요:

```bash
# 1. 의존성 설치
npm install

# 2. TypeScript 타입 체크
npx tsc --noEmit

# 3. ESLint 검사
npx eslint . --ext .ts,.tsx --max-warnings 0

# 4. 환경변수 확인 (.env 파일 존재 여부)
ls -la .env* 2>/dev/null || echo "No .env files found"
```

---

## Phase 2: 5개 에이전트 병렬 분석

**반드시 5개 Task를 동시에 실행**하세요 (병렬):

1. **security-agent**: 보안 취약점 스캔
   - npm audit 실행
   - XSS, SQL Injection, CSRF 패턴 검색
   - 인증/권한 취약점 확인

2. **perf-optimizer**: 성능 분석
   - 불필요한 리렌더링 패턴 검색
   - 메모리 누수 패턴 확인
   - N+1 쿼리 패턴 검색

3. **code-reviewer**: 코드 품질 검토
   - 타입 안전성 확인
   - DRY 원칙 위반 검색
   - 복잡도 높은 함수 식별

4. **test-agent**: 테스트 분석
   - 테스트 커버리지 확인
   - 누락된 테스트 케이스 식별
   - 테스트 품질 검토

5. **verification-agent**: 로직 검증
   - 비즈니스 로직 정확성
   - 엣지 케이스 처리 확인
   - 에러 핸들링 검토

---

## Phase 3: 테스트 & 빌드 (순차)

Phase 2 완료 후 순서대로 실행:

```bash
# 1. 유닛 테스트
npm test

# 2. 빌드 검증
npm run build
```

---

## Phase 4: 통합 리포트

모든 Phase 완료 후 다음 형식으로 리포트 작성:

```
╔══════════════════════════════════════════════════════════╗
║                   DEEP SYNC REPORT                       ║
╠══════════════════════════════════════════════════════════╣
║ Phase 1 - 환경 검증                                       ║
║   npm install:    [통과/실패]                             ║
║   tsc:            [통과/실패] (에러 수)                    ║
║   eslint:         [통과/실패] (경고 수)                    ║
║   .env:           [확인됨/없음]                           ║
╠══════════════════════════════════════════════════════════╣
║ Phase 2 - 에이전트 분석 (5개 병렬)                         ║
║   security:       [X개 이슈] Critical: Y, High: Z         ║
║   performance:    [X개 이슈]                              ║
║   code-quality:   [등급] A/B/C/D                          ║
║   test-coverage:  [X%]                                    ║
║   verification:   [통과/이슈 있음]                         ║
╠══════════════════════════════════════════════════════════╣
║ Phase 3 - 테스트 & 빌드                                   ║
║   npm test:       [X/Y 통과]                              ║
║   npm build:      [성공/실패]                             ║
╠══════════════════════════════════════════════════════════╣
║ 총 이슈: X개 (Critical: A, High: B, Medium: C, Low: D)    ║
║ 자동 수정 가능: Y개                                       ║
╚══════════════════════════════════════════════════════════╝
```

---

## 발견된 이슈 처리

1. **Critical/High**: 즉시 수정
2. **Medium**: 수정 제안
3. **Low**: 리포트에 기록

---

## 중요: 병렬 실행 방법

Phase 2에서 **반드시 단일 메시지에 5개 Task 도구를 동시 호출**해야 합니다:

```
Task(security-agent) + Task(perf-optimizer) + Task(code-reviewer) + Task(test-agent) + Task(verification-agent)
→ 5개 동시 실행 (소요시간 1/5)
```
