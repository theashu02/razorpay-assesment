export type PaymentStatus = 'Active' | 'Paid' | 'Expired';
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
}
export interface PaymentFormData {
  amount: string;
  description: string;
  customerEmail: string;
  customerPhone: string;
  expiryDate: string;
}
export interface PaymentFormErrors {
  amount?: string;
  description?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerContact?: string;
  expiryDate?: string;
}
