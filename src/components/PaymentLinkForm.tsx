import { useState } from 'react';
import type { PaymentFormData, PaymentFormErrors } from '../types/payment';
import { MAX_DESCRIPTION_LENGTH, validatePaymentForm } from '../utils/validation';

const initialForm: PaymentFormData = {
  amount: '',
  description: '',
  customerEmail: '',
  customerPhone: '',
  expiryDate: '',
  allowPartial: false,
  minFirstPayment: '',
};

export default function PaymentLinkForm({
  onCreate,
  onSuccess,
}: {
  onCreate: (data: PaymentFormData) => void;
  onSuccess: (id: string) => void;
}) {
  const [form, setForm] = useState<PaymentFormData>(initialForm);
  const [errors, setErrors] = useState<PaymentFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  function set<K extends keyof PaymentFormData>(key: K, value: string) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function handleBlur(field: string) {
    setTouched((p) => ({ ...p, [field]: true }));
    setErrors(validatePaymentForm({ ...form }, Date.now()));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validatePaymentForm(form, Date.now());
    setErrors(validation);
    setTouched({ amount: true, description: true, customerEmail: true, customerPhone: true, expiryDate: true, minFirstPayment: true });
    if (Object.keys(validation).length > 0) return;
    onCreate(form);
    onSuccess(form.description.trim());
    setForm(initialForm);
    setErrors({});
    setTouched({});
  }

  const show = (k: keyof PaymentFormErrors) => touched[k as string] || Object.keys(errors).length > 0;

  return (
    <section aria-labelledby="create-link-heading" className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 id="create-link-heading" className="text-base font-semibold text-slate-900">
        Create Payment Link
      </h2>
      <p className="mt-1 text-sm text-slate-600">Fill the details below to generate a shareable link.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-slate-700">
            Amount (INR) <span aria-hidden="true" className="text-red-600">*</span>
          </label>
          <div className="relative mt-1">
            <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
              &#8377;
            </span>
            <input
              id="amount"
              name="amount"
              type="text"
              inputMode="decimal"
              placeholder="e.g. 2500.00 (max 5,00,000)"
              autoComplete="off"
              value={form.amount}
              onChange={(e) => set('amount', e.target.value)}
              onBlur={() => handleBlur('amount')}
              aria-invalid={Boolean(errors.amount && show('amount'))}
              aria-describedby={errors.amount ? 'amount-error' : undefined}
              className="w-full rounded-md border border-slate-300 py-2 pl-8 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0a2540] focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
          {errors.amount && show('amount') && (
            <p id="amount-error" role="alert" className="mt-1 text-xs text-red-600">
              {errors.amount}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="expiryDate" className="block text-sm font-medium text-slate-700">
            Expiry Date <span className="font-normal text-slate-500">(optional)</span>
          </label>
          <input
            id="expiryDate"
            name="expiryDate"
            type="datetime-local"
            value={form.expiryDate}
            onChange={(e) => set('expiryDate', e.target.value)}
            onBlur={() => handleBlur('expiryDate')}
            aria-invalid={Boolean(errors.expiryDate)}
            aria-describedby={errors.expiryDate ? 'expiry-error' : undefined}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#0a2540] focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
          {errors.expiryDate && (
            <p id="expiry-error" role="alert" className="mt-1 text-xs text-red-600">
              {errors.expiryDate}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-slate-700">
            Description <span aria-hidden="true" className="text-red-600">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={2}
            maxLength={MAX_DESCRIPTION_LENGTH + 20}
            placeholder="What is this payment for?"
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            onBlur={() => handleBlur('description')}
            aria-invalid={Boolean(errors.description)}
            aria-describedby="desc-hint desc-error"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0a2540] focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
          <div className="mt-1 flex items-center justify-between">
            <div>
              {errors.description && show('description') && (
                <p id="desc-error" role="alert" className="text-xs text-red-600">
                  {errors.description}
                </p>
              )}
            </div>
            <p id="desc-hint" className="text-xs text-slate-500" aria-live="polite">
              {form.description.length}/{MAX_DESCRIPTION_LENGTH}
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="customerEmail" className="block text-sm font-medium text-slate-700">
            Customer Email
          </label>
          <input
            id="customerEmail"
            name="customerEmail"
            type="email"
            autoComplete="email"
            placeholder="customer@example.com"
            value={form.customerEmail}
            onChange={(e) => set('customerEmail', e.target.value)}
            onBlur={() => handleBlur('customerEmail')}
            aria-invalid={Boolean(errors.customerEmail)}
            aria-describedby={errors.customerEmail ? 'email-error' : undefined}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0a2540] focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
          {errors.customerEmail && (
            <p id="email-error" role="alert" className="mt-1 text-xs text-red-600">
              {errors.customerEmail}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="customerPhone" className="block text-sm font-medium text-slate-700">
            Customer Phone
          </label>
          <input
            id="customerPhone"
            name="customerPhone"
            type="tel"
            autoComplete="tel"
            placeholder="+919876543210"
            value={form.customerPhone}
            onChange={(e) => set('customerPhone', e.target.value)}
            onBlur={() => handleBlur('customerPhone')}
            aria-invalid={Boolean(errors.customerPhone)}
            aria-describedby={errors.customerPhone ? 'phone-error' : undefined}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0a2540] focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
          {errors.customerPhone && (
            <p id="phone-error" role="alert" className="mt-1 text-xs text-red-600">
              {errors.customerPhone}
            </p>
          )}
        </div>

        {errors.customerContact && (
          <p role="alert" className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800 ring-1 ring-inset ring-amber-200 md:col-span-2">
            {errors.customerContact}
          </p>
        )}


        <div className="md:col-span-2 rounded-lg border border-neutral-200 bg-[#f4f4f4] p-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
            <input id="allowPartial" name="allowPartial" type="checkbox" checked={form.allowPartial} onChange={(e) => setForm((p) => ({ ...p, allowPartial: e.target.checked }))} className="h-4 w-4 accent-[#0a2540]" />
            Allow partial payments
          </label>
          {form.allowPartial && (
            <div className="mt-2">
              <label htmlFor="minFirstPayment" className="block text-sm font-medium text-slate-700">Minimum first payment (INR) <span aria-hidden="true" className="text-red-600">*</span></label>
              <input id="minFirstPayment" name="minFirstPayment" type="text" inputMode="decimal" placeholder="e.g. 500.00" autoComplete="off" value={form.minFirstPayment} onChange={(e) => set('minFirstPayment', e.target.value)} onBlur={() => handleBlur('minFirstPayment')} aria-invalid={Boolean(errors.minFirstPayment)} aria-describedby={errors.minFirstPayment ? 'min-error' : undefined} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#0a2540] focus:outline-none focus:ring-1 focus:ring-[#0a2540]" />
              {errors.minFirstPayment && (<p id="min-error" role="alert" className="mt-1 text-xs text-red-600">{errors.minFirstPayment}</p>)}
            </div>
          )}
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-md bg-[#0a2540] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#133a6b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a2540] focus-visible:ring-offset-2 sm:w-auto"
          >
            Generate Link
          </button>
        </div>
      </form>
    </section>
  );
}
