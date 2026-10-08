import { afterEach, describe, expect, it, vi } from 'vitest';
import { customerSmsEnabled, quoteConfirmationSmsEnabled } from '@/lib/notify';

afterEach(() => vi.unstubAllEnvs());

describe('customer text switches', () => {
  it('keeps the quote confirmation off unless both switches are on', () => {
    vi.stubEnv('TWILIO_CUSTOMER_SMS', 'enabled');
    vi.stubEnv('TWILIO_QUOTE_CONFIRMATION_SMS', '');
    expect(customerSmsEnabled()).toBe(true);
    expect(quoteConfirmationSmsEnabled()).toBe(false);

    vi.stubEnv('TWILIO_QUOTE_CONFIRMATION_SMS', 'enabled');
    expect(quoteConfirmationSmsEnabled()).toBe(true);

    vi.stubEnv('TWILIO_CUSTOMER_SMS', '');
    expect(quoteConfirmationSmsEnabled()).toBe(false);
  });
});
