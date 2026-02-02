---
description: Generate project scaffolding. /scaffold 또는 "스캐폴드", "구조 만들어" 할 때 사용.
---

# Scaffold Generator

> **Generate project structure and boilerplate**

## Usage
```
/scaffold [type] [name]
```

## Types

### Component
```
/scaffold component UserProfile
```
Creates:
```
src/components/UserProfile/
├── index.tsx
├── UserProfile.tsx
├── UserProfile.test.tsx
└── UserProfile.types.ts
```

### Feature
```
/scaffold feature auth
```
Creates:
```
src/features/auth/
├── components/
│   ├── LoginForm.tsx
│   └── SignupForm.tsx
├── hooks/
│   └── useAuth.ts
├── api/
│   └── auth.ts
├── types/
│   └── auth.types.ts
└── index.ts
```

### API Route
```
/scaffold api users
```
Creates:
```
app/api/users/
├── route.ts
└── [id]/
    └── route.ts
```

### Page
```
/scaffold page dashboard
```
Creates:
```
app/dashboard/
├── page.tsx
├── loading.tsx
├── error.tsx
└── layout.tsx
```

## Templates

### Component Template
```tsx
'use client';

import { ComponentProps } from './Component.types';

export function Component({ }: ComponentProps) {
  return (
    <div>
      {/* Content */}
    </div>
  );
}
```

### API Route Template
```tsx
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const Schema = z.object({
  // Define schema
});

export async function GET(request: NextRequest) {
  try {
    // Implementation
    return NextResponse.json({ data: [] });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

### Hook Template
```tsx
import { useState, useCallback } from 'react';

export function useHook() {
  const [state, setState] = useState(null);

  const action = useCallback(() => {
    // Implementation
  }, []);

  return { state, action };
}
```
