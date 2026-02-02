/**
 * GitHub Handler Module
 * GitHub 템플릿 클론 로직을 처리하는 핸들러
 */

import { spawn } from 'child_process';
import * as path from 'path';
import type { GithubCloneArgs } from '../types.js';

/**
 * 안전한 명령어 실행 (shell injection 방지)
 * execAsync 대신 spawn 사용하여 인자를 배열로 전달
 */
function safeExec(command: string, args: string[], cwd?: string): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      cwd,
      shell: false,  // shell=false로 injection 방지
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    proc.stdout?.on('data', (data) => { stdout += data.toString(); });
    proc.stderr?.on('data', (data) => { stderr += data.toString(); });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(stderr || `Command failed with code ${code}`));
      }
    });

    proc.on('error', reject);
  });
}

/**
 * 입력값 검증 - path traversal 및 injection 방지
 */
function validateInput(input: string, type: 'projectName' | 'url' | 'path'): boolean {
  switch (type) {
    case 'projectName':
      // 프로젝트명: 영문, 숫자, 하이픈, 언더스코어만 허용
      return /^[a-zA-Z0-9_-]+$/.test(input);
    case 'url':
      // URL: https://github.com으로 시작하는 것만 허용
      return /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/.test(input);
    case 'path':
      // 경로: ../ 같은 path traversal 방지
      return !input.includes('..') && !input.includes('~');
    default:
      return false;
  }
}

const GITHUB_TEMPLATES: Record<string, string> = {
  'nextjs-saas': 'https://github.com/vercel/nextjs-subscription-payments',
  't3-app': 'https://github.com/t3-oss/create-t3-app',
  'nextjs-subscription': 'https://github.com/vercel/nextjs-subscription-payments',
  'shadcn-admin': 'https://github.com/shadcn-ui/ui',
  'next-saas-stripe': 'https://github.com/mickasmt/next-saas-stripe-starter',
  'taxonomy': 'https://github.com/shadcn-ui/taxonomy',
};

export async function handleGithubClone(args: GithubCloneArgs): Promise<string> {
  const { template, projectName, targetDir = '.' } = args;

  // 🔒 보안: 입력값 검증
  if (!validateInput(projectName, 'projectName')) {
    return `❌ 유효하지 않은 프로젝트명: ${projectName}
프로젝트명은 영문, 숫자, 하이픈, 언더스코어만 사용 가능합니다.`;
  }

  if (targetDir !== '.' && !validateInput(targetDir, 'path')) {
    return `❌ 유효하지 않은 경로: ${targetDir}
경로에 '..' 또는 '~'를 포함할 수 없습니다.`;
  }

  // 템플릿 URL 결정
  let repoUrl = template;
  if (!template.startsWith('http')) {
    repoUrl = GITHUB_TEMPLATES[template];
    if (!repoUrl) {
      return `알 수 없는 템플릿: ${template}

사용 가능한 템플릿:
${Object.entries(GITHUB_TEMPLATES).map(([name, url]) => `- ${name}: ${url}`).join('\n')}

또는 GitHub URL을 직접 입력하세요.`;
    }
  } else {
    // 🔒 보안: URL 검증
    if (!validateInput(template, 'url')) {
      return `❌ 유효하지 않은 GitHub URL: ${template}
https://github.com/owner/repo 형식만 허용됩니다.`;
    }
  }

  const fullPath = path.join(targetDir, projectName);

  try {
    // 🔒 보안: spawn 사용하여 shell injection 방지
    // git clone 실행 (인자를 배열로 전달)
    await safeExec('git', ['clone', '--depth', '1', repoUrl, fullPath]);

    // .git 폴더 삭제 (새 프로젝트로 시작)
    const gitDir = path.join(fullPath, '.git');
    await safeExec('rm', ['-rf', gitDir]);

    // git init
    await safeExec('git', ['init'], fullPath);

    return `✅ 템플릿 클론 완료!

📁 위치: ${fullPath}
📦 소스: ${repoUrl}

다음 단계:
1. cd ${projectName}
2. npm install
3. .env.example을 .env로 복사하고 설정
4. npm run dev`;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `❌ 클론 실패: ${errorMessage}

수동 클론:
git clone ${repoUrl} ${projectName}`;
  }
}
