/**
 * Stripe Handler Module
 * Stripe 관련 비즈니스 로직을 처리하는 핸들러
 */

import { StripeClient } from '../lib/api-clients/stripe.js';
import type { StripeCheckArgs } from '../types.js';

export async function handleStripeCheck(args: StripeCheckArgs): Promise<string> {
  const { secretKey, action } = args;

  try {
    const client = new StripeClient(secretKey);
    const isTestMode = client.isTestMode();

    switch (action) {
      case 'status': {
        const balance = await client.getBalance();
        return `✅ Stripe 연결 성공!

모드: ${isTestMode ? '🧪 테스트' : '🔴 라이브'}
잔액: ${balance.available?.[0]?.amount / 100 || 0} ${balance.available?.[0]?.currency?.toUpperCase() || 'USD'}`;
      }

      case 'products': {
        const products = await client.getProducts(10);
        return `📦 상품 목록 (${products.data.length}개):

${products.data.map((p) => `- ${p.name} (${p.id}) ${p.active ? '✅' : '❌'}`).join('\n') || '상품 없음'}`;
      }

      case 'prices': {
        const prices = await client.getPrices(10);
        return `💰 가격 목록 (${prices.data.length}개):

${prices.data.map((p) => `- ${p.nickname || p.id}: ${p.unit_amount / 100} ${p.currency.toUpperCase()}/${p.recurring?.interval || 'one-time'}`).join('\n') || '가격 없음'}`;
      }

      case 'webhooks': {
        const webhooks = await client.getWebhooks();
        return `🔗 웹훅 엔드포인트 (${webhooks.data.length}개):

${webhooks.data.map((w) => `- ${w.url}\n  이벤트: ${w.enabled_events.slice(0, 3).join(', ')}${w.enabled_events.length > 3 ? '...' : ''}`).join('\n\n') || '웹훅 없음'}`;
      }

      case 'events': {
        const events = await client.getEvents(5);
        return `📊 최근 이벤트:

${events.data.map((e) => `- ${e.type} (${new Date(e.created * 1000).toLocaleString()})`).join('\n') || '이벤트 없음'}`;
      }

      default:
        return `알 수 없는 action: ${action}`;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `❌ Stripe API 오류: ${errorMessage}`;
  }
}
