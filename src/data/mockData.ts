import type { KhataFilter, LedgerEntry, LoanOfferItem } from "../types";

export const businessHealthIndex = 78;

export const customers = [
  {
    name: "Rajesh Kumar",
    phone: "UPI: rajesh@oksbi",
    balance: 4250,
    status: "Due",
    lastEntry: "Bought vegetables",
    date: "Today",
  },
  {
    name: "Meena Stores",
    phone: "UPI: meenastore@upi",
    balance: -1800,
    status: "Advance",
    lastEntry: "Paid by cash",
    date: "Yesterday",
  },
  {
    name: "Amit Tea Stall",
    phone: "UPI: amitstall@paytm",
    balance: 920,
    status: "Due",
    lastEntry: "Milk packets",
    date: "29 May",
  },
];

export const recentEntries: LedgerEntry[] = [
  {
    label: "Rajesh Kumar",
    note: "Tomato, onion, potato",
    amount: 780,
    type: "out",
    time: "10:45 AM",
    periods: ["today", "month", "year"],
  },
  {
    label: "Meena Stores",
    note: "Cash received",
    amount: 1800,
    type: "in",
    time: "09:20 AM",
    periods: ["today", "month", "year"],
  },
  {
    label: "Amit Tea Stall",
    note: "Milk packets",
    amount: 420,
    type: "out",
    time: "Yesterday",
    periods: ["month", "year"],
  },
];

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
