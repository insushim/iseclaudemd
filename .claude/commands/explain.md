---
description: Explain code in detail. /explain 또는 "설명해줘", "이게 뭐야" 할 때 사용.
---

# Code Explainer

> **Detailed code explanation with examples**

## Usage
```
/explain [file or code block]
```

## Explanation Format

### 1. Overview
- What does this code do?
- Why does it exist?
- Where is it used?

### 2. Line-by-Line Breakdown
```
Line X-Y: [Explanation]
Purpose: [Why this code exists]
```

### 3. Key Concepts
- Design patterns used
- Important libraries/APIs
- TypeScript features

### 4. Data Flow
```
Input → [Processing Steps] → Output
```

### 5. Examples
```typescript
// Example usage
const result = someFunction(input);
// result: { ... }
```

## Output Template
```
## Code Explanation: $ARGUMENTS

### Summary
[1-2 sentence overview]

### Detailed Breakdown

#### Section 1: [Name]
```typescript
// Code snippet
```
**Purpose**: [What it does]
**How it works**: [Step by step]

#### Section 2: [Name]
...

### Key Concepts
- **[Concept 1]**: [Explanation]
- **[Concept 2]**: [Explanation]

### Data Flow
```
[Input] → [Step 1] → [Step 2] → [Output]
```

### Common Use Cases
1. [Use case 1]
2. [Use case 2]

### Related Code
- [Related file/function 1]
- [Related file/function 2]
```

## Tips
- Ask about specific parts if unclear
- Request simpler explanations if needed
- Ask for real-world analogies
