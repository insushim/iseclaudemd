/**
 * Stripe API Client Module
 * Stripe API 호출을 담당하는 클라이언트 모듈
 */

import type {
  StripeBalance,
  StripeListResponse,
  StripeProduct,
  StripePrice,
  StripeWebhook,
  StripeEvent,
  StripeSubscription,
} from '../../types.js';

export class StripeClient {
  private readonly baseUrl = 'https://api.stripe.com/v1';
  private readonly secretKey: string;

  constructor(secretKey: string) {
    if (!secretKey.startsWith('sk_')) {
      throw new Error('Invalid Stripe Secret Key. Must start with sk_');
    }
    this.secretKey = secretKey;
  }

  private get headers(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
  }

  public isTestMode(): boolean {
    return this.secretKey.startsWith('sk_test_');
  }

  public async getBalance(): Promise<StripeBalance> {
    const response = await fetch(`${this.baseUrl}/balance`, { headers: this.headers });
    if (!response.ok) {
      throw new Error(`Stripe API error: ${response.status}`);
    }
    return response.json() as Promise<StripeBalance>;
  }

  public async getProducts(limit = 10): Promise<StripeListResponse<StripeProduct>> {
    const response = await fetch(`${this.baseUrl}/products?limit=${limit}`, { headers: this.headers });
    if (!response.ok) {
      throw new Error(`Stripe API error: ${response.status}`);
    }
    return response.json() as Promise<StripeListResponse<StripeProduct>>;
  }

  public async getPrices(limit = 10): Promise<StripeListResponse<StripePrice>> {
    const response = await fetch(`${this.baseUrl}/prices?limit=${limit}`, { headers: this.headers });
    if (!response.ok) {
      throw new Error(`Stripe API error: ${response.status}`);
    }
    return response.json() as Promise<StripeListResponse<StripePrice>>;
  }

  public async getWebhooks(): Promise<StripeListResponse<StripeWebhook>> {
    const response = await fetch(`${this.baseUrl}/webhook_endpoints`, { headers: this.headers });
    if (!response.ok) {
      throw new Error(`Stripe API error: ${response.status}`);
    }
    return response.json() as Promise<StripeListResponse<StripeWebhook>>;
  }

  public async getEvents(limit = 5): Promise<StripeListResponse<StripeEvent>> {
    const response = await fetch(`${this.baseUrl}/events?limit=${limit}`, { headers: this.headers });
    if (!response.ok) {
      throw new Error(`Stripe API error: ${response.status}`);
    }
    return response.json() as Promise<StripeListResponse<StripeEvent>>;
  }

  public async getActiveSubscriptions(limit = 100): Promise<StripeListResponse<StripeSubscription>> {
    const response = await fetch(`${this.baseUrl}/subscriptions?status=active&limit=${limit}`, {
      headers: this.headers
    });
    if (!response.ok) {
      throw new Error(`Stripe API error: ${response.status}`);
    }
    return response.json() as Promise<StripeListResponse<StripeSubscription>>;
  }

  public async getCustomerCount(): Promise<number> {
    const response = await fetch(`${this.baseUrl}/customers?limit=1`, { headers: this.headers });
    if (!response.ok) {
      throw new Error(`Stripe API error: ${response.status}`);
    }
    const data = await response.json() as StripeListResponse<unknown>;
    return data.has_more ? 1000 : data.data.length;
  }
}
