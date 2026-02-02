import { describe, it, expect, test } from 'vitest';

describe('Simple Test', () => {
  it('should pass', () => {
    expect(1 + 1).toBe(2);
  });

  test('another test', () => {
    expect(true).toBe(true);
  });
});
