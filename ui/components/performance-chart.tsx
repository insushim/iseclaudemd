'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

// Mock data - 실제로는 서버에서 가져올 데이터
const performanceData = [
  { time: '00:00', requests: 120, errors: 2, responseTime: 150 },
  { time: '04:00', requests: 80, errors: 1, responseTime: 140 },
  { time: '08:00', requests: 200, errors: 3, responseTime: 160 },
  { time: '12:00', requests: 350, errors: 5, responseTime: 180 },
  { time: '16:00', requests: 420, errors: 2, responseTime: 145 },
  { time: '20:00', requests: 280, errors: 1, responseTime: 135 },
  { time: '24:00', requests: 150, errors: 0, responseTime: 130 },
];

export function PerformanceChart() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="glassmorphism border-white/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-sm">실시간 성능</CardTitle>
          </div>
          <CardDescription className="text-xs">
            최근 24시간 요청 처리량
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="requestGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
                          <p className="text-sm font-medium">{label}</p>
                          <p className="text-xs text-blue-600">
                            요청: {payload[0].value}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="requests"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#requestGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}