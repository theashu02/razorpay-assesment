import type { PaymentLink } from '../types/payment';

function iso(daysOffset: number, hours = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  d.setHours(d.getHours() + hours);
  return d.toISOString();
}

export const mockPaymentLinks: PaymentLink[] = [
  {
    id: 'plink_MOCK01',
    amount: 2500,
    description: 'Website design advance',
    customerEmail: 'priya.sharma@example.com',
    customerPhone: '+919876543210',
    status: 'Paid',
    paymentUrl: 'https://rzp.io/l/mock01',
    createdAt: iso(-9),
    expiryDate: iso(-2),
  },
  {
    id: 'plink_MOCK02',
    amount: 12999.5,
    description: 'Annual SaaS subscription',
    customerEmail: 'rahul.verma@example.com',
    status: 'Active',
    paymentUrl: 'https://rzp.io/l/mock02',
    createdAt: iso(-4),
    expiryDate: iso(6),
  },
  {
    id: 'plink_MOCK03',
    amount: 499,
    description: 'T-shirt order #4821',
    customerPhone: '+919112223334',
    status: 'Active',
    paymentUrl: 'https://rzp.io/l/mock03',
    createdAt: iso(-6),
    expiryDate: iso(-1),
  },
  {
    id: 'plink_MOCK04',
    amount: 75000,
    description: 'Consulting invoice Jan',
    customerEmail: 'accounts@acmecorp.in',
    status: 'Active',
    paymentUrl: 'https://rzp.io/l/mock04',
    createdAt: iso(-2),
    expiryDate: null,
  },
  {
    id: 'plink_MOCK05',
    amount: 1599.99,
    description: 'Online course fee',
    customerEmail: 'sneha.k@example.com',
    customerPhone: '9812345678',
    status: 'Paid',
    paymentUrl: 'https://rzp.io/l/mock05',
    createdAt: iso(-12),
    expiryDate: iso(10),
  },
  {
    id: 'plink_MOCK06',
    amount: 3200,
    description: 'Freelance logo design',
    customerEmail: 'kabir@example.com',
    status: 'Active',
    paymentUrl: 'https://rzp.io/l/mock06',
    createdAt: iso(-15),
    expiryDate: iso(-10),
  },
];
