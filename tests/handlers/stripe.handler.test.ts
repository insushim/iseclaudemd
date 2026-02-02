/**
 * Stripe Handler 테스트
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Stripe Handler - Key Validation', () => {
  const validateStripeKey = (key: string): { valid: boolean; isTest: boolean } => {
    const valid = key.startsWith('sk_');
    const isTest = key.startsWith('sk_test_');
    return { valid, isTest };
  };

  it('유효한 테스트 키 인식', () => {
    const result = validateStripeKey('sk_test_1234567890');
    expect(result.valid).toBe(true);
    expect(result.isTest).toBe(true);
  });

  it('유효한 라이브 키 인식', () => {
    const result = validateStripeKey('sk_live_1234567890');
    expect(result.valid).toBe(true);
    expect(result.isTest).toBe(false);
  });

  it('잘못된 키 거부', () => {
    expect(validateStripeKey('pk_test_123').valid).toBe(false);  // publishable key
    expect(validateStripeKey('invalid_key').valid).toBe(false);
    expect(validateStripeKey('').valid).toBe(false);
  });
});

describe('Stripe Handler - MRR Calculation', () => {
  interface MockSubscriptionItem {
    price: {
      unit_amount: number;
      recurring?: { interval: 'month' | 'year' };
    };
  }

  const calculateMRR = (items: MockSubscriptionItem[]): number => {
    let mrr = 0;
    items.forEach((item) => {
      const amount = item.price.unit_amount;
      const interval = item.price.recurring?.interval;
      if (interval === 'month') {
        mrr += amount;
      } else if (interval === 'year') {
        mrr += amount / 12;
      }
    });
    return mrr;
  };

  it('월간 구독 MRR 계산', () => {
    const items: MockSubscriptionItem[] = [
      { price: { unit_amount: 1000, recurring: { interval: 'month' } } },
      { price: { unit_amount: 2000, recurring: { interval: 'month' } } },
    ];
    expect(calculateMRR(items)).toBe(3000);
  });

  it('연간 구독 MRR 계산 (월별 환산)', () => {
    const items: MockSubscriptionItem[] = [
      { price: { unit_amount: 12000, recurring: { interval: 'year' } } },
    ];
    expect(calculateMRR(items)).toBe(1000);
  });

  it('혼합 구독 MRR 계산', () => {
    const items: MockSubscriptionItem[] = [
      { price: { unit_amount: 1000, recurring: { interval: 'month' } } },
      { price: { unit_amount: 12000, recurring: { interval: 'year' } } },
    ];
    expect(calculateMRR(items)).toBe(2000); // 1000 + (12000/12)
  });

  it('빈 구독 목록', () => {
    expect(calculateMRR([])).toBe(0);
  });
});
