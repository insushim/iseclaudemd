/**
 * Vercel Handler Module
 * Vercel 관련 비즈니스 로직을 처리하는 핸들러
 */

import { VercelClient } from '../lib/api-clients/vercel.js';
import type { VercelDeployArgs } from '../types.js';

export async function handleVercelDeploy(args: VercelDeployArgs): Promise<string> {
  const { token, projectId, action } = args;

  try {
    const client = new VercelClient(token);

    switch (action) {
      case 'status': {
        const user = await client.getUser();
        return `✅ Vercel 연결 성공!

👤 사용자: ${user.user.name || user.user.username}
📧 이메일: ${user.user.email}`;
      }

      case 'deploy': {
        if (!projectId) {
          const projects = await client.getProjects();
          return `📁 프로젝트 목록:

${projects.map((p) => `- ${p.name} (${p.id})`).join('\n')}

배포하려면 projectId를 지정하세요.`;
        } else {
          const deployments = await client.getDeployments(projectId, 5);
          return `🚀 최근 배포:

${deployments.map((d) => `- ${d.url}\n  상태: ${d.state} | ${new Date(d.created).toLocaleString()}`).join('\n\n')}`;
        }
      }

      case 'envs': {
        if (!projectId) {
          return '프로젝트 ID가 필요합니다.';
        }
        const envs = await client.getEnvironmentVariables(projectId);
        return `🔐 환경 변수 (${envs.length}개):

${envs.map((e) => `- ${e.key} [${e.target.join(', ')}]`).join('\n')}`;
      }

      case 'domains': {
        if (!projectId) {
          return '프로젝트 ID가 필요합니다.';
        }
        const domains = await client.getDomains(projectId);
        return `🌐 도메인:

${domains.map((d) => `- ${d.name} ${d.verified ? '✅' : '❌'}`).join('\n')}`;
      }

      case 'logs': {
        return `📋 로그 확인

Vercel 대시보드에서 확인하세요:
https://vercel.com/dashboard`;
      }

      default:
        return `알 수 없는 action: ${action}`;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `❌ Vercel API 오류: ${errorMessage}`;
  }
}
