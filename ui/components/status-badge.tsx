'use client';

import { motion } from 'framer-motion';
import { cn, getStatusColor } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
  pulse?: boolean;
}

export function StatusBadge({ status, className, pulse = false }: StatusBadgeProps) {
  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return '활성';
      case 'connected':
        return '연결됨';
      case 'pending':
        return '대기중';
      case 'error':
        return '오류';
      case 'warning':
        return '주의';
      case 'inactive':
        return '비활성';
      default:
        return status;
    }
  };

  return (
    <motion.div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        getStatusColor(status),
        pulse && 'animate-pulse-glow',
        className
      )}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={cn(
          'w-1.5 h-1.5 rounded-full',
          status === 'active' && 'bg-green-500',
          status === 'connected' && 'bg-green-500',
          status === 'pending' && 'bg-yellow-500',
          status === 'error' && 'bg-red-500',
          status === 'warning' && 'bg-yellow-500',
          status === 'inactive' && 'bg-gray-500'
        )}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {getStatusText(status)}
    </motion.div>
  );
}