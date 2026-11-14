import { useRef, useState } from "react";
import {
  DashboardHeader,
  EmptyState,
  PaymentLinkForm,
  PaymentLinksTable,
  Sidebar,
  StatusFilters,
  SummaryCards,
  Toast,
  TopBar,
} from "./components";
import { usePaymentLinks, useToast } from "./hooks";
import type { PaymentFormData } from "./types/payment";

export default function App() {
  const { filteredLinks, counts, filter, setFilter, createPaymentLink, recordPayment } =
    usePaymentLinks();
  const { toast, notify, dismiss } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [sideOpen, setSideOpen] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  function handleCreate(data: PaymentFormData) {
    createPaymentLink(data);
    setFilter("All");
  }

  function handleSuccess(desc: string) {
    notify("Payment link created for " + desc);
  }

  function handleRecordPayment(id: string, amount: number) {
    recordPayment(id, amount);
    notify("Payment of " + amount + " recorded");
  }

  function handleCreateClick() {
    setShowForm((s) => !s);
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
    });
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-[#f4f4f4] text-black lg:flex lg:h-screen lg:overflow-hidden">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-sm">Skip to content</a>
      <Sidebar open={sideOpen} onClose={() => setSideOpen(false)} />
      <div className="min-w-0 max-w-full flex-1 overflow-x-clip lg:h-screen lg:overflow-y-auto">
        <TopBar onOpenMenu={() => setSideOpen(true)} />
        <main id="main-content" className="mx-auto min-w-0 max-w-6xl space-y-4 px-4 py-5 sm:px-6">
          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"><DashboardHeader onCreate={handleCreateClick} /></div>
          <SummaryCards total={counts.total} active={counts.active} partially={counts.partially} paid={counts.paid} expired={counts.expired} />
          <div ref={formRef} className="scroll-mt-20">{showForm && <PaymentLinkForm onCreate={handleCreate} onSuccess={handleSuccess} />}</div>
          <section aria-label="Payment links list" className="min-w-0 max-w-full overflow-hidden rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)] sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-[15px] font-bold tracking-tight">All Payment Links ({filteredLinks.length})</h2>
              <StatusFilters active={filter} onChange={setFilter} />
            </div>
            <div className="mt-4">{filteredLinks.length === 0 ? (<EmptyState filter={filter} />) : (<PaymentLinksTable links={filteredLinks} onRecordPayment={handleRecordPayment} />)}</div>
          </section>
          <footer className="pt-1 text-center text-xs text-neutral-500">Mock dashboard - data stored in memory only.</footer>
        </main>
      </div>
      {toast ? <Toast message={toast} onClose={dismiss} /> : <div role="status" aria-live="polite" className="sr-only">Ready</div>}
    </div>
  );
}
