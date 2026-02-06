import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ko-KR').format(num)
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
    case 'success':
    case 'connected':
      return 'text-green-600 bg-green-50 dark:bg-green-900/20'
    case 'pending':
    case 'warning':
      return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
    case 'error':
    case 'failed':
    case 'disconnected':
      return 'text-red-600 bg-red-50 dark:bg-red-900/20'
    case 'inactive':
    case 'paused':
      return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20'
    default:
      return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
  }
}

export function timeAgo(date: Date | string): string {
  const now = new Date()
  const target = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000)

  if (diffInSeconds < 60) return `${diffInSeconds}초 전`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`

  return target.toLocaleDateString('ko-KR')
}