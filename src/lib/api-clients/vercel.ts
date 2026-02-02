/**
 * Vercel API Client Module
 * Vercel API 호출을 담당하는 클라이언트 모듈
 */

import type {
  VercelUser,
  VercelProject,
  VercelDeployment,
  VercelEnv,
  VercelDomain,
} from '../../types.js';

export class VercelClient {
  private readonly baseUrl = 'https://api.vercel.com';
  private readonly token: string;

  constructor(token: string) {
    this.token = token;
  }

  private get headers(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };
  }

  public async getUser(): Promise<VercelUser> {
    const response = await fetch(`${this.baseUrl}/v2/user`, { headers: this.headers });
    if (!response.ok) {
      throw new Error(`Vercel API error: ${response.status}`);
    }
    return response.json() as Promise<VercelUser>;
  }

  public async getProjects(): Promise<VercelProject[]> {
    const response = await fetch(`${this.baseUrl}/v9/projects`, { headers: this.headers });
    if (!response.ok) {
      throw new Error(`Vercel API error: ${response.status}`);
    }
    const data = await response.json() as { projects: VercelProject[] };
    return data.projects;
  }

  public async getDeployments(projectId: string, limit = 5): Promise<VercelDeployment[]> {
    const response = await fetch(
      `${this.baseUrl}/v6/deployments?projectId=${projectId}&limit=${limit}`,
      { headers: this.headers }
    );
    if (!response.ok) {
      throw new Error(`Vercel API error: ${response.status}`);
    }
    const data = await response.json() as { deployments: VercelDeployment[] };
    return data.deployments;
  }

  public async getEnvironmentVariables(projectId: string): Promise<VercelEnv[]> {
    const response = await fetch(`${this.baseUrl}/v10/projects/${projectId}/env`, {
      headers: this.headers
    });
    if (!response.ok) {
      throw new Error(`Vercel API error: ${response.status}`);
    }
    const data = await response.json() as { envs: VercelEnv[] };
    return data.envs;
  }

  public async getDomains(projectId: string): Promise<VercelDomain[]> {
    const response = await fetch(`${this.baseUrl}/v9/projects/${projectId}/domains`, {
      headers: this.headers
    });
    if (!response.ok) {
      throw new Error(`Vercel API error: ${response.status}`);
    }
    const data = await response.json() as { domains: VercelDomain[] };
    return data.domains;
  }
}
