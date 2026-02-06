'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/status-badge';
import { ChevronRight, LucideIcon } from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils';

interface Tool {
  name: string;
  description: string;
  icon: LucideIcon;
  status: string;
  lastUsed: string;
  usage: number;
}

interface ToolCardProps {
  tool: Tool;
  index: number;
}

export function ToolCard({ tool, index }: ToolCardProps) {
  const { name, description, icon: Icon, status, lastUsed, usage } = tool;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 relative overflow-hidden">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-300",
                status === 'connected' && "bg-green-100 text-green-600 dark:bg-green-900/20",
                status === 'active' && "bg-blue-100 text-blue-600 dark:bg-blue-900/20",
                status === 'warning' && "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20",
                status === 'error' && "bg-red-100 text-red-600 dark:bg-red-900/20"
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold group-hover:text-blue-600 transition-colors duration-300">
                  {name}
                </CardTitle>
                <StatusBadge status={status} className="mt-1" />
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </CardHeader>

        <CardContent>
          <CardDescription className="text-xs mb-3 line-clamp-2">
            {description}
          </CardDescription>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">최근 사용</span>
              <span className="font-medium">{lastUsed}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">사용 횟수</span>
              <span className="font-medium">{formatNumber(usage)}</span>
            </div>
          </div>

          {/* Usage Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-muted-foreground">활성도</span>
              <span className="text-xs font-medium">{Math.min(usage, 100)}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(usage, 100)}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}