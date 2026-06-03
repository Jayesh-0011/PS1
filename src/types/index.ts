export type KhataFilter = "today" | "month" | "year";

export type Page = "home" | "khata" | "alerts" | "loans" | "profile";

export type TransactionIntent = "sale" | "expense" | "khata";

export type ProfileActionType = "gstr_report" | "bank_business_status";

export interface LedgerEntry {
  id?: string;
  label: string;
  note: string;
  amount: number;
  type: "in" | "out";
  time: string;
  periods: KhataFilter[];
  entryDate?: string;
  source?: "khata" | "business";
  isUserAdded?: boolean;
}

export interface HomeStats {
  sales: number;
  expenses: number;
}

export interface TransactionInput {
  customer: string;
  note: string;
  amount: number;
  type: "in" | "out";
}

export interface Customer {
  name: string;
  phone: string;
  balance: number;
  status: string;
  lastEntry: string;
  date: string;
}

export interface InventoryRow {
  id: string;
  label: string;
  quantity: number;
  unit: string;
  value: string;
}

export interface BusinessTransaction {
  id?: string;
  transaction_type: "sale" | "expense";
  amount: number;
  note: string;
  transaction_date: string;
}

export interface KhataOverview {
  moneyIn: string;
  moneyOut: string;
  cashFlow: string;
}

export interface ReminderItem {
  id?: string;
  title: string;
  description: string;
  tag: string;
  tone: string;
}

export interface LoanOfferItem {
  id?: string;
  name: string;
  amount: string;
  tenure: string;
  rate: string;
  minScore: number;
}

export interface VendorProfileView {
  name: string;
  businessType: string;
  initials: string;
  upiId: string;
  businessHealthIndex: number;
  aadhaar: { status: "Completed" | "Pending"; value: string };
  pan: { status: "Completed" | "Pending"; value: string };
  bank: { status: "Completed" | "Pending"; value: string };
  upi: { status: "Completed" | "Pending"; value: string };
  shopAddress: { status: "Completed" | "Pending"; value: string };
}

export interface HomeAlert {
  text: string;
}
