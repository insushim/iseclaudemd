---
description: 치명적 오류를 우선 감지하고 수정합니다 (무한 루프, 메모리 누수, 스택 오버플로우)
---

# 🔴 치명적 오류 우선 수정

> **모든 작업을 중단하고 치명적 오류부터 수정합니다**

## 1단계: 치명적 오류 스캔

```bash
# TypeScript 에러 스캔
npx tsc --noEmit 2>&1 | head -50
```

## 2단계: 무한 루프 감지

다음 패턴을 검색하세요:

### useEffect 무한 루프
```tsx
// ❌ 문제 패턴
useEffect(() => {
  setState(newValue); // 의존성 배열 없음 → 무한 루프
});

useEffect(() => {
  setCount(count + 1); // count가 의존성에 있음 → 무한 루프
}, [count]);
```

### while/for 무한 루프
```tsx
// ❌ 문제 패턴
while (true) { /* break 없음 */ }
for (;;) { /* break 없음 */ }
```

## 3단계: 메모리 누수 감지

```tsx
// ❌ 문제: cleanup 없는 setInterval
useEffect(() => {
  setInterval(() => {}, 1000); // clearInterval 없음
}, []);

// ✅ 해결
useEffect(() => {
  const id = setInterval(() => {}, 1000);
  return () => clearInterval(id); // cleanup 추가
}, []);
```

## 4단계: 수정 후 검증

```bash
npx tsc --noEmit
npm run dev
```

## ⚠️ 규칙

1. **CRITICAL 오류는 즉시 수정**
2. **다른 작업 진행 전 반드시 치명적 오류 해결**
3. **최소 변경 원칙 적용**
