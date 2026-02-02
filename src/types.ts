/**
 * Claude SaaS MCP - 타입 정의
 */

// ============================================
// Stripe API 타입
// ============================================

export interface StripeBalance {
  available: Array<{
    amount: number;
    currency: string;
  }>;
  pending: Array<{
    amount: number;
    currency: string;
  }>;
}

export interface StripeProduct {
  id: string;
  name: string;
  active: boolean;
  description?: string;
}

export interface StripePrice {
  id: string;
  nickname?: string;
  unit_amount: number;
  currency: string;
  recurring?: {
    interval: 'day' | 'week' | 'month' | 'year';
  };
}

export interface StripeWebhook {
  id: string;
  url: string;
  enabled_events: string[];
  status: string;
}

export interface StripeEvent {
  id: string;
  type: string;
  created: number;
}

export interface StripeSubscription {
  id: string;
  status: string;
  items: {
    data: Array<{
      price: StripePrice;
    }>;
  };
}

export interface StripeListResponse<T> {
  data: T[];
  has_more: boolean;
}

// ============================================
// Supabase API 타입
// ============================================

export interface SupabaseSchema {
  definitions: Record<string, unknown>;
}

// ============================================
// Vercel API 타입
// ============================================

export interface VercelUser {
  user: {
    name?: string;
    username: string;
    email: string;
  };
}

export interface VercelProject {
  id: string;
  name: string;
}

export interface VercelDeployment {
  uid: string;
  url: string;
  state: 'READY' | 'ERROR' | 'BUILDING' | 'QUEUED';
  created: number;
}

export interface VercelEnv {
  key: string;
  value?: string;
  target: string[];
}

export interface VercelDomain {
  name: string;
  verified: boolean;
}

// ============================================
// 도구 인자 타입
// ============================================

export interface GithubCloneArgs {
  template: string;
  projectName: string;
  targetDir?: string;
}

export interface StripeCheckArgs {
  secretKey: string;
  action: 'status' | 'products' | 'prices' | 'webhooks' | 'events';
}

export interface SupabaseCheckArgs {
  projectUrl: string;
  anonKey: string;
  serviceKey?: string;
  action: 'status' | 'tables' | 'rls' | 'functions';
}

export interface VercelDeployArgs {
  token: string;
  projectId?: string;
  action: 'status' | 'deploy' | 'envs' | 'domains' | 'logs';
}

export interface EnvValidateArgs {
  projectPath: string;
  type?: 'nextauth' | 'stripe' | 'supabase' | 'all';
}

export interface PrismaAnalyzeArgs {
  schemaPath: string;
  action?: 'analyze' | 'visualize' | 'suggest' | 'migrations';
}

export interface ApiHealthcheckArgs {
  endpoints: string[];
  timeout?: number;
}

export interface DepsSecurityArgs {
  projectPath: string;
  action?: 'audit' | 'outdated' | 'licenses';
}

export interface SaasMetricsArgs {
  stripeKey: string;
  period?: 'today' | 'week' | 'month' | 'year';
}

export interface SaasInitArgs {
  projectName: string;
  targetDir?: string;
  features?: string[];
}

// ============================================
// npm audit 타입
// ============================================

export interface NpmAuditResult {
  metadata?: {
    vulnerabilities?: {
      critical?: number;
      high?: number;
      moderate?: number;
      low?: number;
    };
  };
}

export interface NpmOutdatedResult {
  [packageName: string]: {
    current: string;
    wanted: string;
    latest: string;
  };
}

// ============================================
// 유틸리티 타입
// ============================================

export type ToolHandler<T> = (args: T) => Promise<string>;

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}
