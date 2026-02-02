/**
 * Prisma Handler Module
 * Prisma 스키마 분석 로직을 처리하는 핸들러
 */

import * as fs from 'fs';
import * as path from 'path';
import type { PrismaAnalyzeArgs } from '../types.js';

export async function handlePrismaAnalyze(args: PrismaAnalyzeArgs): Promise<string> {
  const { schemaPath, action = 'analyze' } = args;

  if (!fs.existsSync(schemaPath)) {
    return `❌ 스키마 파일을 찾을 수 없습니다: ${schemaPath}`;
  }

  const schema = fs.readFileSync(schemaPath, 'utf-8');
  const results: string[] = [];

  switch (action) {
    case 'analyze': {
      // 모델 추출
      const modelMatches = schema.match(/model\s+(\w+)\s*\{[^}]+\}/g) || [];
      const models = modelMatches.map(m => {
        const nameMatch = m.match(/model\s+(\w+)/);
        const fields = (m.match(/^\s+\w+\s+\w+/gm) || []).length;
        return { name: nameMatch?.[1] || '', fields };
      });

      results.push(`📊 Prisma 스키마 분석\n`);
      results.push(`모델 수: ${models.length}개\n`);

      models.forEach(m => {
        results.push(`  - ${m.name} (${m.fields} 필드)`);
      });

      // 관계 분석
      const relations = (schema.match(/@relation/g) || []).length;
      results.push(`\n관계: ${relations}개`);

      // 인덱스 분석
      const indexes = (schema.match(/@@index|@@unique/g) || []).length;
      results.push(`인덱스: ${indexes}개`);

      // 권장사항
      results.push('\n💡 권장사항:');
      if (indexes < models.length) {
        results.push('  - 인덱스 추가 검토 필요 (쿼리 성능 향상)');
      }
      if (!schema.includes('@@map')) {
        results.push('  - @@map으로 테이블명 매핑 검토');
      }
      if (!schema.includes('updatedAt')) {
        results.push('  - updatedAt 필드 추가 권장');
      }
      break;
    }

    case 'visualize': {
      results.push('📐 스키마 시각화\n');
      const vizModels = schema.match(/model\s+(\w+)/g) || [];
      vizModels.forEach(m => {
        const name = m.replace('model ', '');
        results.push(`┌─ ${name}`);

        // 관계 찾기
        const relationPattern = new RegExp(`${name}\\s+${name}\\[\\]|${name}\\?`, 'g');
        const relatedModels = schema.match(relationPattern) || [];
        if (relatedModels.length > 0) {
          results.push(`│  └─→ 관계 있음`);
        }
        results.push('└────────');
      });
      break;
    }

    case 'migrations': {
      results.push('📁 마이그레이션 상태\n');
      const migrationsDir = path.join(path.dirname(schemaPath), 'migrations');
      if (fs.existsSync(migrationsDir)) {
        const migrations = fs.readdirSync(migrationsDir).filter(f => f !== 'migration_lock.toml');
        results.push(`마이그레이션 수: ${migrations.length}개`);
        migrations.slice(-5).forEach(m => {
          results.push(`  - ${m}`);
        });
      } else {
        results.push('마이그레이션 폴더가 없습니다.');
        results.push('npx prisma migrate dev --name init');
      }
      break;
    }
  }

  return results.join('\n');
}
