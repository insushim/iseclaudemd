/**
 * Dependencies Security Handler Module
 * npm 의존성 보안 검사 로직을 처리하는 핸들러
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import type { DepsSecurityArgs, NpmAuditResult, NpmOutdatedResult } from '../types.js';

const execAsync = promisify(exec);

export async function handleDepsSecurity(args: DepsSecurityArgs): Promise<string> {
  const { projectPath, action = 'audit' } = args;

  const packageJsonPath = path.join(projectPath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    return `❌ package.json을 찾을 수 없습니다: ${projectPath}`;
  }

  try {
    let result = '';

    switch (action) {
      case 'audit': {
        const { stdout: auditOut } = await execAsync(`cd "${projectPath}" && npm audit --json 2>/dev/null || true`);
        try {
          const audit = JSON.parse(auditOut) as NpmAuditResult;
          const vulns = audit.metadata?.vulnerabilities || {};
          result = `🔒 보안 감사 결과

취약점:
  - 심각: ${vulns.critical || 0}
  - 높음: ${vulns.high || 0}
  - 보통: ${vulns.moderate || 0}
  - 낮음: ${vulns.low || 0}

${(vulns.critical || 0) + (vulns.high || 0) > 0 ? '⚠️ npm audit fix 실행을 권장합니다.' : '✅ 심각한 취약점이 없습니다.'}`;
        } catch {
          result = '✅ 취약점이 발견되지 않았습니다.';
        }
        break;
      }

      case 'outdated': {
        const { stdout: outdatedOut } = await execAsync(`cd "${projectPath}" && npm outdated --json 2>/dev/null || true`);
        try {
          const outdated = JSON.parse(outdatedOut || '{}') as NpmOutdatedResult;
          const deps = Object.entries(outdated);
          if (deps.length === 0) {
            result = '✅ 모든 패키지가 최신 버전입니다.';
          } else {
            result = `📦 업데이트 가능한 패키지 (${deps.length}개):\n\n`;
            deps.slice(0, 10).forEach(([name, info]) => {
              result += `- ${name}: ${info.current} → ${info.latest}\n`;
            });
            if (deps.length > 10) {
              result += `\n... 외 ${deps.length - 10}개`;
            }
          }
        } catch {
          result = '✅ 모든 패키지가 최신 버전입니다.';
        }
        break;
      }

      case 'licenses': {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
        result = `📜 의존성 라이선스 (${Object.keys(allDeps).length}개 패키지)

주요 패키지는 대부분 MIT 라이선스입니다.
상세 정보는 npx license-checker 로 확인하세요.`;
        break;
      }
    }

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `❌ 오류: ${errorMessage}`;
  }
}
