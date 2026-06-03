import { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarDays,
  Filter,
  IndianRupee,
  Minus,
  Plus,
  Search,
} from "lucide-react";
import { EntryRow } from "../components/EntryRow";
import { MiniStat } from "../components/MiniStat";
import { SectionTitle } from "../components/SectionTitle";
import { khataFilters } from "../data/mockData";
import { computeKhataSummaryFromEntries } from "../lib/khata";
import type { KhataFilter, LedgerEntry } from "../types";

interface KhataPageProps {
  entries: LedgerEntry[];
  totalReceivable: number;
  onAddSale: () => void;
  onAddExpense: () => void;
}

export const KhataPage = ({
  entries,
  totalReceivable,
  onAddSale,
  onAddExpense,
}: KhataPageProps) => {
  const [activeFilter, setActiveFilter] = useState<KhataFilter>("today");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const summary = computeKhataSummaryFromEntries(entries, activeFilter);
  const activeFilterLabel =
    khataFilters.find((filter) => filter.value === activeFilter)?.label ??
    "Today";

  const filteredRecentEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return entries.filter((entry) => {
      if (!entry.periods.includes(activeFilter)) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        entry.label.toLowerCase().includes(query) ||
        entry.note.toLowerCase().includes(query)
      );
    });
  }, [activeFilter, entries, searchQuery]);

  return (
    <>
      <header className="bg-emerald-700 px-5 pb-5 pt-5 text-white">
        <div className="flex items-center justify-between">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
            <BookOpen size={21} />
          </button>
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-100">
              Digital Khata
            </p>
            <h1 className="text-lg font-bold">Sales &amp; Expenses</h1>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
            <Bell size={20} />
          </button>
        </div>

        <section className="mt-5 rounded-2xl bg-white p-4 text-slate-950">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Total receivable</p>
              <h2 className="mt-1 flex items-center text-3xl font-black">
                <IndianRupee size={25} />
                {totalReceivable.toLocaleString("en-IN")}
              </h2>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
              {filteredRecentEntries.length} entries
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <MiniStat
              icon={<ArrowDownLeft size={17} />}
              label="Money in"
              value={summary.moneyIn}
              tone="green"
            />
            <MiniStat
              icon={<ArrowUpRight size={17} />}
              label="Money out"
              value={summary.moneyOut}
              tone="red"
            />
          </div>
        </section>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-24 pt-4">
        <div className="flex gap-2">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-slate-100 px-3 py-3 text-slate-500">
            <Search size={18} />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-500"
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search entries"
              type="search"
              value={searchQuery}
            />
          </label>
          <button
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white"
            type="button"
          >
            <CalendarDays size={20} />
          </button>
        </div>

        <div className="relative mt-4 flex justify-end">
          <button
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white"
            onClick={() => setIsFilterOpen((isOpen) => !isOpen)}
            type="button"
          >
            <Filter size={17} />
            {activeFilterLabel}
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 top-14 z-10 w-36 rounded-xl border border-slate-200 bg-white p-1 shadow-lg shadow-slate-300/60">
              {khataFilters.map((filter) => (
                <button
                  key={filter.value}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm font-bold ${
                    activeFilter === filter.value
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-600"
                  }`}
                  onClick={() => {
                    setActiveFilter(filter.value);
                    setIsFilterOpen(false);
                  }}
                  type="button"
                >
                  {filter.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white"
            onClick={onAddSale}
            type="button"
          >
            <Plus size={18} />
            Add Sale
          </button>
          <button
            className="flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-bold text-white"
            onClick={onAddExpense}
            type="button"
          >
            <Minus size={18} />
            Add Expense
          </button>
        </div>

        <SectionTitle action="Export" title="Recent Entries" />
        <div className="rounded-2xl border border-slate-200">
          {filteredRecentEntries.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-slate-500">
              No entries for {activeFilterLabel.toLowerCase()}. Tap Add Sale or
              Add Expense above.
            </p>
          ) : (
            filteredRecentEntries.map((entry, index) => (
              <EntryRow
                key={entry.id ?? `${entry.label}-${entry.time}-${entry.note}`}
                isLast={index === filteredRecentEntries.length - 1}
                {...entry}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};
