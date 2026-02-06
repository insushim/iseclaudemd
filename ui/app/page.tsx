'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Server,
  Activity,
  Shield,
  CreditCard,
  Database,
  Globe,
  Zap,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  Settings,
  ChevronRight,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { StatusBadge } from '@/components/status-badge';
import { MetricCard } from '@/components/metric-card';
import { ToolCard } from '@/components/tool-card';
import { PerformanceChart } from '@/components/performance-chart';
import { ActivityFeed } from '@/components/activity-feed';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function Dashboard() {
  // Mock data - 실제로는 MCP 서버에서 가져올 데이터
  const serverStatus = {
    status: 'active',
    uptime: '99.9%',
    requests: 15247,
    errors: 3,
  };

  const tools = [
    {
      name: 'Stripe Check',
      description: 'Stripe 연결 상태 및 결제 데이터 확인',
      icon: CreditCard,
      status: 'connected',
      lastUsed: '2분 전',
      usage: 156,
    },
    {
      name: 'Supabase Check',
      description: 'Supabase 데이터베이스 상태 모니터링',
      icon: Database,
      status: 'connected',
      lastUsed: '5분 전',
      usage: 89,
    },
    {
      name: 'Vercel Deploy',
      description: 'Vercel 배포 및 프로젝트 관리',
      icon: Globe,
      status: 'active',
      lastUsed: '1시간 전',
      usage: 23,
    },
    {
      name: 'API Healthcheck',
      description: '여러 엔드포인트 동시 헬스체크',
      icon: Activity,
      status: 'active',
      lastUsed: '30분 전',
      usage: 45,
    },
    {
      name: 'Security Audit',
      description: '의존성 보안 취약점 검사',
      icon: Shield,
      status: 'warning',
      lastUsed: '1일 전',
      usage: 12,
    },
    {
      name: 'SaaS Metrics',
      description: 'SaaS 핵심 지표 조회 (MRR, ARPU)',
      icon: TrendingUp,
      status: 'connected',
      lastUsed: '1시간 전',
      usage: 67,
    },
  ];

  const metrics = [
    {
      title: '총 요청 수',
      value: '15,247',
      change: '+12.5%',
      trend: 'up' as const,
      icon: Activity,
    },
    {
      title: '활성 연결',
      value: '8',
      change: '+2',
      trend: 'up' as const,
      icon: Users,
    },
    {
      title: '평균 응답시간',
      value: '143ms',
      change: '-5.2%',
      trend: 'down' as const,
      icon: BarChart3,
    },
    {
      title: '성공률',
      value: '99.8%',
      change: '+0.1%',
      trend: 'up' as const,
      icon: Shield,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Header */}
      <motion.header
        className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                <Server className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gradient">iswmcp</h1>
            </div>
            <StatusBadge status={serverStatus.status} />
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main
        className="container py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.section className="mb-8" variants={itemVariants}>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gradient mb-4">
              SaaS MCP 서버 대시보드
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stripe, Supabase, Vercel 등 외부 API와 연동된 MCP 도구들을 모니터링하고 관리하세요.
              실시간 성능 지표와 상태를 한눈에 확인할 수 있습니다.
            </p>
          </div>
        </motion.section>

        {/* Metrics Grid */}
        <motion.section className="mb-8" variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <MetricCard key={metric.title} metric={metric} index={index} />
            ))}
          </div>
        </motion.section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tools Grid */}
          <motion.section className="lg:col-span-2" variants={itemVariants}>
            <Card className="h-fit">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-blue-600" />
                      MCP 도구
                    </CardTitle>
                    <CardDescription>
                      사용 가능한 도구들의 상태와 최근 활동
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tools.map((tool, index) => (
                    <ToolCard key={tool.name} tool={tool} index={index} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Sidebar */}
          <motion.aside className="space-y-6" variants={itemVariants}>
            {/* Performance Chart */}
            <PerformanceChart />

            {/* Activity Feed */}
            <ActivityFeed />

            {/* Quick Actions */}
            <Card className="glassmorphism border-white/20">
              <CardHeader>
                <CardTitle className="text-sm">빠른 작업</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="glow" className="w-full justify-start" size="sm">
                  <Play className="h-4 w-4" />
                  새 프로젝트 초기화
                </Button>
                <Button variant="glass" className="w-full justify-start" size="sm">
                  <BarChart3 className="h-4 w-4" />
                  전체 시스템 분석
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Shield className="h-4 w-4" />
                  보안 스캔 실행
                </Button>
              </CardContent>
            </Card>
          </motion.aside>
        </div>

        {/* Footer */}
        <motion.footer
          className="mt-16 text-center text-sm text-muted-foreground"
          variants={itemVariants}
        >
          <p>iswmcp v7.0 - SaaS MCP Server Dashboard</p>
          <p>Powered by Claude Code & Modern UI Components</p>
        </motion.footer>
      </motion.main>
    </div>
  );
}