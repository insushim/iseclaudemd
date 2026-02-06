'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { timeAgo, cn } from '@/lib/utils';

interface Activity {
  id: string;
  type: 'success' | 'warning' | 'error';
  message: string;
  timestamp: Date;
  tool?: string;
}

// Mock data
const activities: Activity[] = [
  {
    id: '1',
    type: 'success',
    message: 'Stripe 연결 확인 완료',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    tool: 'stripe_check',
  },
  {
    id: '2',
    type: 'success',
    message: 'Supabase 헬스체크 성공',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    tool: 'supabase_check',
  },
  {
    id: '3',
    type: 'warning',
    message: '보안 취약점 3개 발견',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    tool: 'deps_security',
  },
  {
    id: '4',
    type: 'success',
    message: 'Vercel 배포 완료',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    tool: 'vercel_deploy',
  },
  {
    id: '5',
    type: 'error',
    message: 'API 엔드포인트 응답 없음',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    tool: 'api_healthcheck',
  },
];

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'warning':
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case 'error':
      return <XCircle className="h-4 w-4 text-red-500" />;
  }
};

const getActivityColor = (type: Activity['type']) => {
  switch (type) {
    case 'success':
      return 'border-l-green-500 bg-green-50/50 dark:bg-green-900/10';
    case 'warning':
      return 'border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10';
    case 'error':
      return 'border-l-red-500 bg-red-50/50 dark:bg-red-900/10';
  }
};

export function ActivityFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="glassmorphism border-white/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-sm">최근 활동</CardTitle>
          </div>
          <CardDescription className="text-xs">
            도구별 실행 기록
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={cn(
                  'border-l-2 pl-3 py-2 rounded-r',
                  getActivityColor(activity.type)
                )}
              >
                <div className="flex items-start gap-2">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">
                      {activity.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {activity.tool && (
                        <span className="text-xs px-1.5 py-0.5 bg-muted rounded text-muted-foreground">
                          {activity.tool}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {timeAgo(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}