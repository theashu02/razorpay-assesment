export type PaymentStatus = 'Active' | 'Partially paid' | 'Paid' | 'Expired';
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
