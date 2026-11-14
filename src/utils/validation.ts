import type { PaymentFormData, PaymentFormErrors } from '../types/payment';

export const MAX_AMOUNT = 500000;
export const MAX_DESCRIPTION_LENGTH = 100;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAmount(raw: string): string | undefined {
  const value = raw.trim();
  if (!value) return 'Amount is required';
  // Allow only numbers with up to 2 decimals
  if (!/^\d+(\.\d{1,2})?$/.test(value)) {
    if (/^-/.test(value)) return 'Amount must be greater than zero';
    if (/^\d+\.\d{3,}$/.test(value)) return 'Amount can have maximum 2 decimal places';
    return 'Enter a valid amount';
  }
  const num = Number(value);
  if (!Number.isFinite(num)) return 'Enter a valid amount';
  if (num <= 0) return 'Amount must be greater than zero';
  if (num > MAX_AMOUNT) return 'Amount cannot exceed \u20B95,00,000';
  return undefined;
}

export function validateDescription(raw: string): string | undefined {
  if (!raw.trim()) return 'Description is required';
  if (raw.length > MAX_DESCRIPTION_LENGTH) {
    return `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`;
  }
  return undefined;
}

export function validateEmail(raw: string): string | undefined {
  const value = raw.trim();
  if (!value) return undefined;
  if (!EMAIL_RE.test(value)) return 'Enter a valid email address';
  return undefined;
}

export function validatePhone(raw: string): string | undefined {
  const value = raw.trim();
  if (!value) return undefined;
  const compact = value.replace(/[\s\-()]/g, '');
  if (!/^\+?\d+$/.test(compact)) return 'Enter a valid phone number';
  const digits = compact.replace(/^\+/, '');
  if (digits.length < 7 || digits.length > 15) return 'Enter a valid phone number';
  return undefined;
}

export function validateExpiry(raw: string, now: number = Date.now()): string | undefined {
  const value = raw.trim();
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return 'Enter a valid expiry date';
  if (d.getTime() <= now) return 'Expiry date must be in the future';
  return undefined;
}

export function validatePaymentForm(data: PaymentFormData, now: number = Date.now()): PaymentFormErrors {
  const errors: PaymentFormErrors = {};
  const amountError = validateAmount(data.amount);
  if (amountError) errors.amount = amountError;

  const descError = validateDescription(data.description);
  if (descError) errors.description = descError;

  const emailError = validateEmail(data.customerEmail);
  if (emailError) errors.customerEmail = emailError;

  const phoneError = validatePhone(data.customerPhone);
  if (phoneError) errors.customerPhone = phoneError;

  const hasEmail = data.customerEmail.trim().length > 0;
  const hasPhone = data.customerPhone.trim().length > 0;
  if (!hasEmail && !hasPhone) {
    errors.customerContact = 'Customer email or phone is required';
  }

  const expiryError = validateExpiry(data.expiryDate, now);
  if (expiryError) errors.expiryDate = expiryError;

  return errors;
}

export function isFormValid(errors: PaymentFormErrors): boolean {
  return Object.keys(errors).length === 0;
}
