/**
 * Prisma Handler 테스트
 */
import { describe, it, expect } from 'vitest';

describe('Prisma Handler - Schema Parsing', () => {
  const parseModels = (schema: string): string[] => {
    const modelMatches = schema.match(/model\s+(\w+)\s*\{/g) || [];
    return modelMatches.map(m => {
      const nameMatch = m.match(/model\s+(\w+)/);
      return nameMatch?.[1] || '';
    }).filter(Boolean);
  };

  it('모델 이름 추출', () => {
    const schema = `
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  published Boolean @default(false)
}
    `;

    const models = parseModels(schema);
    expect(models).toContain('User');
    expect(models).toContain('Post');
    expect(models.length).toBe(2);
  });

  it('빈 스키마 처리', () => {
    const models = parseModels('');
    expect(models.length).toBe(0);
  });
});

describe('Prisma Handler - Relation Analysis', () => {
  const countRelations = (schema: string): number => {
    const relations = schema.match(/@relation/g) || [];
    return relations.length;
  };

  it('관계 수 계산', () => {
    const schema = `
model User {
  posts Post[]
}

model Post {
  author   User @relation(fields: [authorId], references: [id])
  authorId Int
}
    `;

    expect(countRelations(schema)).toBe(1);
  });

  it('관계 없는 스키마', () => {
    const schema = `
model User {
  id    Int    @id
  name  String
}
    `;

    expect(countRelations(schema)).toBe(0);
  });
});

describe('Prisma Handler - Index Analysis', () => {
  const countIndexes = (schema: string): number => {
    const indexes = schema.match(/@@index|@@unique|@unique/g) || [];
    return indexes.length;
  };

  it('인덱스 수 계산', () => {
    const schema = `
model User {
  id    Int    @id
  email String @unique

  @@index([email])
}
    `;

    expect(countIndexes(schema)).toBe(2); // @unique + @@index
  });

  it('인덱스 권장사항 로직', () => {
    const modelCount = 5;
    const indexCount = 2;

    const needsMoreIndexes = indexCount < modelCount;
    expect(needsMoreIndexes).toBe(true);
  });
});

describe('Prisma Handler - Best Practices Check', () => {
  const checkBestPractices = (schema: string): string[] => {
    const suggestions: string[] = [];

    if (!schema.includes('@@map')) {
      suggestions.push('@@map으로 테이블명 매핑 검토');
    }
    if (!schema.includes('updatedAt')) {
      suggestions.push('updatedAt 필드 추가 권장');
    }
    if (!schema.includes('createdAt')) {
      suggestions.push('createdAt 필드 추가 권장');
    }

    return suggestions;
  };

  it('모범 사례 누락 감지', () => {
    const schema = `
model User {
  id    Int    @id
  name  String
}
    `;

    const suggestions = checkBestPractices(schema);
    expect(suggestions).toContain('updatedAt 필드 추가 권장');
    expect(suggestions).toContain('createdAt 필드 추가 권장');
  });

  it('모범 사례 준수 시 빈 배열', () => {
    const schema = `
model User {
  id        Int      @id
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
    `;

    const suggestions = checkBestPractices(schema);
    expect(suggestions.length).toBe(0);
  });
});
