---
name: writing-workflow
description: Writing workflow for content creation. "글쓰기", "블로그", "문서 작성", "콘텐츠", "기사" triggers this.
tools:
  - Read
  - Write
  - WebSearch
  - WebFetch
---

# Writing Workflow Skill

## Triggers
- "글쓰기", "블로그", "문서 작성"
- "콘텐츠", "기사", "글 써줘"
- "포스트", "아티클", "리포트"

## Writing Process

### 1. Research Phase
```yaml
steps:
  - Identify topic and target audience
  - Search for credible sources (minimum 3)
  - Gather key facts and statistics
  - Note different perspectives
```

### 2. Outline Creation
```markdown
# [Title]

## Hook (Attention grabber)
- Opening question or statement
- Why this matters

## Introduction
- Context setting
- Thesis statement
- Preview of main points

## Body
### Point 1: [Topic]
- Supporting evidence
- Example

### Point 2: [Topic]
- Supporting evidence
- Example

### Point 3: [Topic]
- Supporting evidence
- Example

## Conclusion
- Summary of key points
- Call to action
- Final thought
```

### 3. Writing Styles

#### Blog Post
```markdown
# [Catchy Title with Keyword]

*Reading time: X minutes*

[Hook - Question or bold statement]

In this post, you'll learn:
- Point 1
- Point 2
- Point 3

## [H2 Heading]
[Content with short paragraphs]

> Pro tip: [Actionable advice]

## [H2 Heading]
[Content]

### [H3 Subheading]
[Details]

## Conclusion
[Summary + CTA]

---
*Did you find this helpful? Share your thoughts in the comments!*
```

#### Technical Documentation
```markdown
# [Feature/API Name]

## Overview
Brief description of what this does.

## Prerequisites
- Requirement 1
- Requirement 2

## Installation
\`\`\`bash
npm install package-name
\`\`\`

## Usage
\`\`\`typescript
// Example code
\`\`\`

## API Reference
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| name | string | Yes | ... |

## Examples
[Real-world usage examples]

## Troubleshooting
| Issue | Solution |
|-------|----------|
| Error X | Do Y |
```

#### Marketing Copy
```yaml
structure:
  headline: Grab attention (benefit-focused)
  subheadline: Expand on promise
  problem: Identify pain point
  solution: Introduce your offering
  benefits: List 3-5 key benefits
  social_proof: Testimonials/stats
  cta: Clear action step
  urgency: Why act now
```

### 4. SEO Checklist
```yaml
on_page:
  - [ ] Keyword in title (front-loaded)
  - [ ] Keyword in first 100 words
  - [ ] Keyword in at least one H2
  - [ ] Meta description (150-160 chars)
  - [ ] Alt text for images
  - [ ] Internal links (2-3)
  - [ ] External links to authority sources
  - [ ] URL contains keyword
```

### 5. Editing Checklist
```yaml
content:
  - [ ] Clear thesis/main point
  - [ ] Logical flow
  - [ ] Supporting evidence
  - [ ] No jargon (or explained)

style:
  - [ ] Active voice
  - [ ] Varied sentence length
  - [ ] No filler words
  - [ ] Consistent tone

grammar:
  - [ ] Spelling check
  - [ ] Grammar check
  - [ ] Punctuation
  - [ ] Formatting consistent
```
