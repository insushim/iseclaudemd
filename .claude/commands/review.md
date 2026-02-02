---
description: Code review command. /review 또는 "리뷰해줘", "검토해줘" 할 때 사용.
---

# Code Review

> **Comprehensive code review with actionable feedback**

## Review Categories

### 1. Code Quality
```yaml
checks:
  - Naming conventions (clear, descriptive)
  - Function length (< 50 lines recommended)
  - Complexity (cyclomatic < 10)
  - DRY principle (no duplication)
  - Single responsibility
```

### 2. TypeScript
```yaml
checks:
  - Proper type annotations
  - No 'any' types
  - Null safety
  - Discriminated unions where appropriate
  - Zod for runtime validation
```

### 3. React Best Practices
```yaml
checks:
  - Proper hooks usage
  - Memoization where needed
  - Key props in lists
  - Error boundaries
  - Loading states
```

### 4. Security
```yaml
checks:
  - Input validation
  - XSS prevention
  - SQL injection (use Prisma)
  - Sensitive data exposure
  - Authentication checks
```

### 5. Performance
```yaml
checks:
  - Unnecessary re-renders
  - Bundle size impact
  - Image optimization
  - Lazy loading
  - Query efficiency
```

## Output Format
```
## Code Review: $ARGUMENTS

### Summary
- Files reviewed: X
- Issues found: Y
- Severity: [Critical/High/Medium/Low]

### Critical Issues
- [ ] [File:Line] [Issue description]

### Improvements
- [ ] [File:Line] [Suggestion]

### Good Practices Found
- [Positive observation]

### Recommendations
1. [Priority action]
2. [Secondary action]
```

## Commands
```bash
# Type check
npx tsc --noEmit

# Lint
npm run lint

# Format check
npx prettier --check .
```
