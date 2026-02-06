/**
 * Claude Ultimate MCP Server v7.0 - Enhanced Types
 * 성장 지향적 고도화 타입 정의
 */

// 기존 타입들 재export
export * from './types.js';

// ============================================
// 🔴 치명적 오류 감지
// ============================================
export interface CriticalIssue {
  type: 'infinite_loop' | 'memory_leak' | 'stack_overflow' | 'deadlock' | 'sql_injection' | 'xss';
  severity: 'critical' | 'high' | 'medium' | 'low';
  file: string;
  line: number;
  description: string;
  fix?: string;
}

export interface CriticalFirstArgs {
  projectPath?: string;
  autoFix?: boolean;
}

// ============================================
// 🔀 EPCT + 병렬 처리
// ============================================
export interface EPCTWorkflow {
  id: string;
  stage: 'expand' | 'plan' | 'code' | 'test' | 'completed';
  tasks: EPCTTask[];
  parallelExecution: boolean;
  estimatedTime: number; // minutes
}

export interface EPCTTask {
  id: string;
  name: string;
  type: 'research' | 'design' | 'code' | 'test' | 'deploy';
  dependencies: string[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  agent?: string;
  result?: string;
  duration?: number;
}

export interface FullstackEPCTArgs {
  projectType: 'saas' | 'ecommerce' | 'blog' | 'dashboard' | 'game';
  name?: string;
  features?: string[];
  targetDir?: string;
  parallel?: boolean;
}

export interface ParallelArgs {
  tasks: {
    name: string;
    agent: string;
    args: Record<string, unknown>;
  }[];
  maxConcurrency?: number;
}

// ============================================
// 🤖 서브에이전트
// ============================================
export interface SubagentResult {
  agent: string;
  task: string;
  status: 'success' | 'error';
  result: string;
  duration: number;
  metadata?: Record<string, unknown>;
}

export interface SubagentResearchArgs {
  topic: string;
  sources?: string[];
  depth?: 'quick' | 'medium' | 'deep';
}

export interface SubagentReviewArgs {
  projectPath: string;
  focus?: 'security' | 'performance' | 'quality' | 'all';
}

export interface SubagentTestArgs {
  projectPath: string;
  testType?: 'unit' | 'integration' | 'e2e' | 'all';
  generateMissing?: boolean;
}

// ============================================
// 🇰🇷 한국어 자연어 처리
// ============================================
export interface KoreanNaturalArgs {
  input: string;
  context?: string;
}

export interface KoreanPattern {
  patterns: string[];
  intent: string;
  action: string;
  confidence: number;
}

// ============================================
// 🎨 UI 및 에셋 생성
// ============================================
export interface ElegantUIArgs {
  componentType: 'landing' | 'dashboard' | 'auth' | 'profile' | 'settings';
  style?: 'modern' | 'minimal' | 'corporate' | 'creative';
  colorScheme?: 'blue' | 'purple' | 'green' | 'custom';
  features?: string[];
}

export interface NameGeneratorArgs {
  domain: 'saas' | 'ecommerce' | 'fintech' | 'edtech' | 'healthcare' | 'gaming';
  style?: 'korean' | 'english' | 'mixed';
  count?: number;
}

export interface AssetGeneratorArgs {
  projectName: string;
  style?: 'modern' | 'retro' | 'minimal' | 'bold';
  colors?: string[];
  generateAll?: boolean; // favicon, og-image, logo
}

// ============================================
// 🌐 브라우저 테스트
// ============================================
export interface BrowserTestArgs {
  url: string;
  tests?: ('responsive' | 'performance' | 'accessibility' | 'seo' | 'security')[];
  screenshot?: boolean;
  devices?: string[];
}

export interface BrowserTestResult {
  url: string;
  timestamp: string;
  performance: {
    fcp: number; // First Contentful Paint
    lcp: number; // Largest Contentful Paint
    cls: number; // Cumulative Layout Shift
    fid: number; // First Input Delay
  };
  accessibility: {
    score: number;
    violations: string[];
  };
  seo: {
    score: number;
    issues: string[];
  };
  screenshots?: {
    device: string;
    path: string;
  }[];
}

// ============================================
// 🚀 배포 자동화
// ============================================
export interface AutoDeployArgs {
  platform: 'vercel' | 'netlify' | 'docker' | 'aws';
  projectPath?: string;
  envVars?: Record<string, string>;
  domainSetup?: boolean;
}

export interface DeployResult {
  platform: string;
  url: string;
  status: 'success' | 'failed';
  buildTime: number;
  deployTime: number;
  errors?: string[];
}

// ============================================
// 💡 스킬 시스템
// ============================================
export interface SkillDocsArgs {
  projectPath: string;
  docType?: 'api' | 'components' | 'setup' | 'full';
  format?: 'markdown' | 'notion' | 'confluence';
}

export interface SkillRefactorArgs {
  projectPath: string;
  target?: 'components' | 'utils' | 'api' | 'all';
  rules?: string[];
}

export interface SkillOptimizeArgs {
  projectPath: string;
  optimizeType?: 'performance' | 'bundle' | 'images' | 'all';
  aggressive?: boolean;
}

// ============================================
// 🔧 Fix EPCT
// ============================================
export interface FixEPCTArgs {
  projectPath: string;
  errorType?: 'build' | 'runtime' | 'test' | 'all';
  autoApply?: boolean;
}

export interface FixResult {
  issue: string;
  solution: string;
  applied: boolean;
  confidence: number;
  files: string[];
}

// ============================================
// 🎮 게임 개발 특화
// ============================================
export interface GameSaasArgs {
  gameType: 'casual' | 'puzzle' | 'strategy' | 'rpg' | 'multiplayer';
  platform: 'web' | 'mobile' | 'desktop' | 'all';
  monetization?: ('ads' | 'iap' | 'subscription' | 'nft')[];
  features?: string[];
}

// ============================================
// 📊 고급 분석
// ============================================
export interface AnalyticsArgs {
  projectPath: string;
  metrics?: ('performance' | 'bundle' | 'deps' | 'security' | 'quality')[];
  outputFormat?: 'json' | 'html' | 'pdf';
}

export interface ProjectMetrics {
  performance: {
    buildTime: number;
    bundleSize: number;
    loadTime: number;
  };
  quality: {
    testCoverage: number;
    codeComplexity: number;
    maintainability: number;
  };
  security: {
    vulnerabilities: number;
    score: number;
  };
  dependencies: {
    total: number;
    outdated: number;
    vulnerable: number;
  };
}

// ============================================
// 🚀 Productivity Boosters
// ============================================
export interface SmartScaffoldArgs {
  projectName: string;
  template: 'nextjs-saas' | 'remix-saas' | 'sveltekit-saas' | 'astro-saas';
  ai_features?: ('chatbot' | 'recommendations' | 'analytics' | 'automation')[];
  integrations?: string[];
}

export interface BatchProcessArgs {
  operation: 'format' | 'lint' | 'test' | 'build' | 'type-check';
  projects: string[];
  parallel?: boolean;
}

export interface AutoCompleteArgs {
  context: string;
  language?: string;
  style?: 'functional' | 'class' | 'hooks';
}

// ============================================
// 🔄 Workflow Types
// ============================================
export interface WorkflowStep {
  id: string;
  name: string;
  type: 'manual' | 'automated';
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  agent?: string;
  duration?: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  parallel: boolean;
  estimatedDuration: number;
  createdAt: string;
  completedAt?: string;
}

// ============================================
// 🌍 Multi-language Support
// ============================================
export interface I18nArgs {
  projectPath: string;
  languages: string[];
  autoTranslate?: boolean;
  context?: string;
}

export interface Translation {
  key: string;
  values: Record<string, string>;
  context?: string;
  pluralized?: boolean;
}