export default function DashboardHeader({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0a2540]">Collections</p>
        <h1 className="mt-1 text-[26px] font-bold leading-tight tracking-tight text-black">Payment Links</h1>
        <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-neutral-600">Create shareable links and track collections. Expired links flip automatically.</p>
      </div>
      <button type="button" onClick={onCreate} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0a2540] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#133a6b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a2540] focus-visible:ring-offset-2 active:scale-[0.99]">
        <span aria-hidden="true" className="text-base leading-none">+</span> Create Payment Link
      </button>
    </div>
  );
}
