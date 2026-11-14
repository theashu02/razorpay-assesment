import { describe, expect, it } from 'vitest';
import { validateAmount, validateEmail, validatePhone, validatePaymentForm } from './validation';
describe('payment amount validation', () => {
  it('requires amount', () => {
    expect(validateAmount('')).toBe('Amount is required');
  });
  it('rejects zero and negatives', () => {
    expect(validateAmount('0')).toBe('Amount must be greater than zero');
    expect(validateAmount('-5')).toBe('Amount must be greater than zero');
  });
  it('rejects more than 2 decimals', () => {
    expect(validateAmount('10.123')).toBe('Amount can have maximum 2 decimal places');
  });
  it('rejects amount above max', () => {
    expect(validateAmount('500001')).toContain('cannot exceed');
  });
  it('accepts valid amounts', () => {
    expect(validateAmount('1')).toBeUndefined();
    expect(validateAmount('2500.50')).toBeUndefined();
    expect(validateAmount('500000')).toBeUndefined();
  });
});
describe('customer contact validation', () => {
  it('requires email or phone', () => {
    const errors = validatePaymentForm({
      amount: '100',
      description: 'Test pay',
      customerEmail: '',
      customerPhone: '',
      expiryDate: '',
      allowPartial: false,
      minFirstPayment: '',
    });
    expect(errors.customerContact).toBe('Customer email or phone is required');
  });
  it('accepts email only', () => {
    const errors = validatePaymentForm({
      amount: '100',
      description: 'Test pay',
      customerEmail: 'a@b.com',
      customerPhone: '',
      expiryDate: '',
      allowPartial: false,
      minFirstPayment: '',
    });
    expect(errors.customerContact).toBeUndefined();
    expect(errors.customerEmail).toBeUndefined();
  });
  it('rejects invalid email and phone', () => {
    expect(validateEmail('not-an-email')).toBe('Enter a valid email address');
    expect(validatePhone('abc')).toBe('Enter a valid phone number');
    expect(validatePhone('123')).toBe('Enter a valid phone number');
  });
  it('accepts valid phone', () => {
    expect(validatePhone('+919876543210')).toBeUndefined();
    expect(validatePhone('9812345678')).toBeUndefined();
  });
});

describe('partial payment validation', () => {
  it('requires min first payment when allowed', async () => {
    const m = await import('./validation');
    expect(m.validateMinFirstPayment('', '1000', true)).toContain('required');
    expect(m.validateMinFirstPayment('0', '1000', true)).toContain('greater than zero');
    expect(m.validateMinFirstPayment('1500', '1000', true)).toContain('cannot exceed');
    expect(m.validateMinFirstPayment('500', '1000', true)).toBeUndefined();
    expect(m.validateMinFirstPayment('', '1000', false)).toBeUndefined();
    expect(m.validateRecordPayment('0', 500)).toContain('greater than zero');
    expect(m.validateRecordPayment('600', 500)).toContain('cannot exceed due');
    expect(m.validateRecordPayment('200', 500)).toBeUndefined();
  });
});

