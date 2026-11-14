const fs = require("fs");
// 1. TYPES
fs.writeFileSync("src/types/payment.ts", `export type PaymentStatus = 'Active' | 'Partially paid' | 'Paid' | 'Expired';
export type StoredStatus = 'Active' | 'Paid';
export type StatusFilter = 'All' | PaymentStatus;
export interface PaymentLink {
  id: string;
  amount: number;
  description: string;
  customerEmail?: string;
  customerPhone?: string;
  status: StoredStatus;
  paymentUrl: string;
  createdAt: string;
  expiryDate?: string | null;
  allowPartial: boolean;
  minFirstPayment?: number;
  amountPaid: number;
}
export interface PaymentFormData {
  amount: string;
  description: string;
  customerEmail: string;
  customerPhone: string;
  expiryDate: string;
  allowPartial: boolean;
  minFirstPayment: string;
}
export interface PaymentFormErrors {
  amount?: string;
  description?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerContact?: string;
  expiryDate?: string;
  minFirstPayment?: string;
}
`);
console.log("types done");
// 2. VALIDATION additions
let v = fs.readFileSync("src/utils/validation.ts","utf8");
if (!v.includes("validateMinFirstPayment")) {
  v += `
export function validateMinFirstPayment(raw: string, amountRaw: string, allowPartial: boolean): string | undefined {
  if (!allowPartial) return undefined;
  const value = raw.trim();
  if (!value) return 'Minimum first payment is required when partial payments are allowed';
  if (!/^\\d+(\\.\\d{1,2})?$/.test(value)) return 'Enter a valid amount';
  const num = Number(value);
  const amt = Number(amountRaw);
  if (!Number.isFinite(num) || num <= 0) return 'Minimum first payment must be greater than zero';
  if (Number.isFinite(amt) && amt > 0 && num > amt) return 'Minimum first payment cannot exceed amount';
  return undefined;
}
export function validateRecordPayment(raw: string, due: number): string | undefined {
  const value = raw.trim();
  if (!value) return 'Enter a payment amount';
  if (!/^\\d+(\\.\\d{1,2})?$/.test(value)) return 'Enter a valid amount';
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return 'Amount must be greater than zero';
  if (num - due > 0.009) return 'Amount cannot exceed due (\\u20B9' + due.toFixed(2) + ')';
  return undefined;
}
`;
  // hook minFirstPayment into validatePaymentForm
  v = v.replace("export function validatePaymentForm(data: PaymentFormData, now: number = Date.now()): PaymentFormErrors {",
`export function validatePaymentForm(data: PaymentFormData, now: number = Date.now()): PaymentFormErrors {`);
  v = v.replace("  const expiryError = validateExpiry(data.expiryDate, now);",
`  const minErr = validateMinFirstPayment(data.minFirstPayment, data.amount, data.allowPartial);
  if (minErr) errors.minFirstPayment = minErr;
  const expiryError = validateExpiry(data.expiryDate, now);`);
  fs.writeFileSync("src/utils/validation.ts", v);
  console.log("validation extended");
}
// 3. PAYMENT STATUS rewrite
fs.writeFileSync("src/utils/paymentStatus.ts", `import type { PaymentLink, PaymentStatus, StatusFilter } from '../types/payment';
export function amountDue(link: PaymentLink): number {
  return Math.max(0, Number((link.amount - link.amountPaid).toFixed(2)));
}
export function getEffectiveStatus(link: PaymentLink, now: number = Date.now()): PaymentStatus {
  const paid = link.amountPaid >= link.amount - 0.009 || link.status === 'Paid' && link.amountPaid >= link.amount - 0.009;
  if (link.status === 'Paid' || link.amountPaid >= link.amount - 0.009) return 'Paid';
  void paid;
  if (link.expiryDate) {
    const expiry = new Date(link.expiryDate).getTime();
    if (!Number.isNaN(expiry) && expiry <= now) return 'Expired';
  }
  if (link.amountPaid > 0) return 'Partially paid';
  return 'Active';
}
export interface StatusCounts { total: number; active: number; partially: number; paid: number; expired: number; }
export function getStatusCounts(links: PaymentLink[], now: number = Date.now()): StatusCounts {
  let active = 0; let partially = 0; let paid = 0; let expired = 0;
  for (const link of links) {
    const s = getEffectiveStatus(link, now);
    if (s === 'Active') active += 1;
    else if (s === 'Partially paid') partially += 1;
    else if (s === 'Paid') paid += 1;
    else expired += 1;
  }
  return { total: links.length, active, partially, paid, expired };
}
export function filterLinksByStatus(links: PaymentLink[], filter: StatusFilter, now: number = Date.now()): PaymentLink[] {
  if (filter === 'All') return links;
  return links.filter((l) => getEffectiveStatus(l, now) === filter);
}
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: amount % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 }).format(amount);
}
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '\\u2014';
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).format(d);
}
export function formatDateOnly(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '\\u2014';
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(d);
}
export function generateLinkId(): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  const time = Date.now().toString(36).toUpperCase().slice(-4);
  return 'plink_' + time + rand;
}
export function buildPaymentUrl(id: string): string {
  return 'https://rzp.io/l/' + id.replace(/^plink_/, '').toLowerCase();
}
`);
console.log("status done");
