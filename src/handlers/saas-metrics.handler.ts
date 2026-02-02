/**
 * SaaS Metrics Handler Module
 * SaaS 핵심 지표 조회 로직을 처리하는 핸들러
 */

import { StripeClient } from '../lib/api-clients/stripe.js';
import type { SaasMetricsArgs } from '../types.js';

export async function handleSaasMetrics(args: SaasMetricsArgs): Promise<string> {
  const { stripeKey, period = 'month' } = args;

  try {
    const client = new StripeClient(stripeKey);

    // 구독 조회
    const subs = await client.getActiveSubscriptions(100);

    // MRR 계산
    let mrr = 0;
    subs.data?.forEach((sub) => {
      sub.items?.data?.forEach((item) => {
        const amount = item.price?.unit_amount || 0;
        const interval = item.price?.recurring?.interval;
        if (interval === 'month') {
          mrr += amount;
        } else if (interval === 'year') {
          mrr += amount / 12;
        }
      });
    });

    const activeSubscribers = subs.data?.length || 0;
    const arpu = activeSubscribers > 0 ? mrr / activeSubscribers : 0;

    return `📊 SaaS 핵심 지표

💰 MRR (월간 반복 매출): $${(mrr / 100).toFixed(2)}
👥 활성 구독자: ${activeSubscribers}명
📈 ARPU (사용자당 평균 매출): $${(arpu / 100).toFixed(2)}

${client.isTestMode() ? '⚠️ 테스트 모드 데이터입니다.' : ''}`;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `❌ Stripe API 오류: ${errorMessage}`;
  }
}
