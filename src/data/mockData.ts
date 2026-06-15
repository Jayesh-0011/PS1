import type { KhataFilter, LedgerEntry, LoanOfferItem } from "../types";

export const businessHealthIndex = 78;

export const customers = [];

export const recentEntries: LedgerEntry[] = [];

export const khataFilters = [
  { label: "Today", value: "today" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
] as const satisfies ReadonlyArray<{ label: string; value: KhataFilter }>;

export const loanOffers: LoanOfferItem[] = [
  {
    name: "Daily Working Capital",
    amount: "Rs 15,000",
    tenure: "45 days",
    rate: "1.2% monthly",
    minScore: 70,
  },
  {
    name: "Inventory Booster",
    amount: "Rs 25,000",
    tenure: "90 days",
    rate: "1.5% monthly",
    minScore: 80,
  },
  {
    name: "Festival Stock Loan",
    amount: "Rs 40,000",
    tenure: "120 days",
    rate: "1.8% monthly",
    minScore: 85,
  },
];
