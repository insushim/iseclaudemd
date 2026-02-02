/**
 * Supabase API Client Module
 * Supabase API 호출을 담당하는 클라이언트 모듈
 */

import type { SupabaseSchema } from '../../types.js';

export class SupabaseClient {
  private readonly projectUrl: string;
  private readonly anonKey: string;
  private readonly serviceKey?: string;

  constructor(projectUrl: string, anonKey: string, serviceKey?: string) {
    this.projectUrl = projectUrl;
    this.anonKey = anonKey;
    this.serviceKey = serviceKey;
  }

  private get headers(): Record<string, string> {
    return {
      'apikey': this.anonKey,
      'Authorization': `Bearer ${this.serviceKey || this.anonKey}`,
      'Content-Type': 'application/json',
    };
  }

  public async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.projectUrl}/rest/v1/`, { headers: this.headers });
      return response.ok;
    } catch {
      return false;
    }
  }

  public async getTables(): Promise<string[]> {
    const response = await fetch(`${this.projectUrl}/rest/v1/`, {
      headers: { ...this.headers, 'Accept': 'application/openapi+json' }
    });

    if (!response.ok) {
      throw new Error(`Supabase API error: ${response.status}`);
    }

    const schema = await response.json() as SupabaseSchema;
    return Object.keys(schema.definitions || {});
  }

  public getDashboardUrl(path: string): string {
    return this.projectUrl.replace('.supabase.co', '.supabase.com') + path;
  }
}
