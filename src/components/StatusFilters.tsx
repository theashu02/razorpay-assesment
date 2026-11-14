import type { StatusFilter } from '../types/payment';
const TABS: StatusFilter[] = ['All', 'Active', 'Partially paid', 'Paid', 'Expired'];
export default function StatusFilters({ active, onChange }: { active: StatusFilter; onChange: (f: StatusFilter) => void }) {
  return (
    <div role="tablist" aria-label="Filter payment links by status" className="flex flex-wrap gap-2">
      {TABS.map((t) => {
        const selected = t === active;
        return (
          <button key={t} role="tab" aria-selected={selected} onClick={() => onChange(t)}
            className={'rounded-full px-4 py-1.5 text-sm font-medium ring-1 ring-inset focus:outline-none focus-visible:ring-2 focus-visible:ring-black ' + (selected ? 'bg-black text-white ring-black' : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-50 hover:text-slate-900')}>
            {t}
          </button>
        );
      })}
    </div>
  );
}
