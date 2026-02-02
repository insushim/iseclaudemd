/**
 * API Healthcheck Handler Module
 * API 엔드포인트 상태 확인 로직을 처리하는 핸들러
 */

import type { ApiHealthcheckArgs } from '../types.js';

export async function handleApiHealthcheck(args: ApiHealthcheckArgs): Promise<string> {
  const { endpoints, timeout = 5000 } = args;

  const results: string[] = ['🏥 API 헬스체크 결과\n'];

  for (const url of endpoints) {
    try {
      const start = Date.now();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        signal: controller.signal,
        method: 'HEAD'
      }).catch(() => fetch(url, { signal: controller.signal }));

      clearTimeout(timeoutId);
      const duration = Date.now() - start;

      if (response.ok) {
        results.push(`✅ ${url}`);
        results.push(`   상태: ${response.status} | 응답: ${duration}ms`);
      } else {
        results.push(`⚠️ ${url}`);
        results.push(`   상태: ${response.status} | 응답: ${duration}ms`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      results.push(`❌ ${url}`);
      results.push(`   오류: ${errorMessage}`);
    }
  }

  return results.join('\n');
}
