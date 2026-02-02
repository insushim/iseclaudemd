/**
 * Supabase Handler Module
 * Supabase 관련 비즈니스 로직을 처리하는 핸들러
 */

import { SupabaseClient } from '../lib/api-clients/supabase.js';
import type { SupabaseCheckArgs } from '../types.js';

export async function handleSupabaseCheck(args: SupabaseCheckArgs): Promise<string> {
  const { projectUrl, anonKey, serviceKey, action } = args;

  try {
    const client = new SupabaseClient(projectUrl, anonKey, serviceKey);

    switch (action) {
      case 'status': {
        const isHealthy = await client.checkHealth();
        return isHealthy
          ? `✅ Supabase 연결 성공!\n\nURL: ${projectUrl}\n상태: 정상`
          : `❌ 연결 실패`;
      }

      case 'tables': {
        const tables = await client.getTables();
        return `📊 테이블 목록 (${tables.length}개):

${tables.map(t => `- ${t}`).join('\n') || '테이블 없음'}`;
      }

      case 'rls': {
        const dashboardUrl = client.getDashboardUrl('/project/_/auth/policies');
        return `🔒 RLS 정책 확인

RLS(Row Level Security) 상태를 확인하려면 Supabase 대시보드에서 확인하세요:
${dashboardUrl}`;
      }

      case 'functions': {
        const dashboardUrl = client.getDashboardUrl('/project/_/functions');
        return `⚡ Edge Functions

Edge Functions 목록을 확인하려면:
${dashboardUrl}`;
      }

      default:
        return `알 수 없는 action: ${action}`;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `❌ Supabase 오류: ${errorMessage}`;
  }
}
