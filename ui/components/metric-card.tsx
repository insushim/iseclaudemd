'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Metric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon?: LucideIcon;
}

interface MetricCardProps {
  metric: Metric;
  index: number;
}

export function MetricCard({ metric, index }: MetricCardProps) {
  const { title, value, change, trend, icon: Icon } = metric;
  const isPositive = trend === 'up';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {title}
              </p>
              <p className="text-2xl font-bold">
                {value}
              </p>
            </div>

            {Icon && (
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <Icon className="h-6 w-6" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 mt-2">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span
              className={cn(
                'text-sm font-medium',
                isPositive ? 'text-green-600' : 'text-red-600'
              )}
            >
              {change}
            </span>
            <span className="text-sm text-muted-foreground">지난 주 대비</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}