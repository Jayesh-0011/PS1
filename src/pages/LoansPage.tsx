import { Bell, CreditCard } from "lucide-react";
import { LoanCard } from "../components/LoanCard";
import { SectionTitle } from "../components/SectionTitle";
import type { LoanOfferItem } from "../types";

interface LoansPageProps {
  businessHealthIndex: number;
  loanOffers: LoanOfferItem[];
}

export const LoansPage = ({
  businessHealthIndex,
  loanOffers,
}: LoansPageProps) => (
  <>
    <header className="bg-emerald-700 px-5 pb-5 pt-5 text-white">
      <div className="flex items-center justify-between">
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
          <CreditCard size={21} />
        </button>
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-100">
            Loan Offers
          </p>
          <h1 className="text-lg font-bold">Business Loans</h1>
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
          <Bell size={20} />
        </button>
      </div>

      <section className="mt-5 rounded-2xl bg-white p-4 text-slate-950">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Business Health Index</p>
            <p className="mt-1 text-3xl font-black">{businessHealthIndex} / 100</p>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
            Good
          </span>
        </div>
        <div className="mt-3 h-3 w-full rounded-full bg-gray-200">
          <div
            className="h-3 rounded-full bg-green-500"
            style={{ width: `${businessHealthIndex}%` }}
          />
        </div>
      </section>
    </header>

    <div className="flex-1 overflow-y-auto px-4 pb-24 pt-4">
      <SectionTitle action="Raw data" title="Available Loans" />
      <div className="space-y-3">
        {loanOffers.map((loan) => (
          <LoanCard
            key={loan.id ?? loan.name}
            businessHealthIndex={businessHealthIndex}
            {...loan}
          />
        ))}
      </div>
    </div>
  </>
);
