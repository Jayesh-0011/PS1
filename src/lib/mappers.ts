import type {
  BusinessTransaction,
  Customer,
  HomeAlert,
  HomeStats,
  InventoryRow,
  KhataFilter,
  KhataOverview,
  LedgerEntry,
  LoanOfferItem,
  ReminderItem,
  VendorProfileView,
} from "../types";
import type {
  BusinessTransactionRecord,
  CustomerRecord,
  InventoryItem,
  KhataEntry,
  LoanOffer,
  Reminder,
  VendorProfile,
} from "./supabaseRest";

const formatRupees = (value: number) =>
  `Rs ${value.toLocaleString("en-IN")}`;

export const getLocalDateKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const toDateKey = (date: Date) => getLocalDateKey(date);

const parseDateKey = (value: string) => {
  const datePart = value.split("T")[0];
  const [year, month, day] = datePart.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const getEntryPeriods = (entryDate: string): KhataFilter[] => {
  const date = parseDateKey(entryDate);
  const today = new Date();
  const periods: KhataFilter[] = [];

  if (toDateKey(date) === toDateKey(today)) {
    periods.push("today");
  }

  if (
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    periods.push("month");
  }

  if (date.getFullYear() === today.getFullYear()) {
    periods.push("year");
  }

  return periods;
};

export const formatEntryTime = (entryDate: string, createdAt: string) => {
  const date = parseDateKey(entryDate);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (toDateKey(date) === toDateKey(today)) {
    return new Date(createdAt).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  if (toDateKey(date) === toDateKey(yesterday)) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

export const formatRelativeDate = (entryDate: string) => {
  const date = parseDateKey(entryDate);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (toDateKey(date) === toDateKey(today)) {
    return "Today";
  }

  if (toDateKey(date) === toDateKey(yesterday)) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

export const mapKhataEntryToLedger = (entry: KhataEntry): LedgerEntry => ({
  id: entry.id,
  label: entry.customer_name,
  note: entry.note,
  amount: Number(entry.amount),
  type: entry.entry_type === "money_in" ? "in" : "out",
  time: formatEntryTime(entry.entry_date, entry.created_at),
  periods: getEntryPeriods(entry.entry_date),
  entryDate: entry.entry_date,
  source: "khata",
});

export const mapBusinessToLedgerEntry = (
  transaction: BusinessTransaction,
): LedgerEntry => {
  const isPending = transaction.id?.startsWith("temp-");

  return {
    id: transaction.id ?? `business-${transaction.transaction_date}-${transaction.note}`,
    label: transaction.transaction_type === "sale" ? "Sale" : "Expense",
    note: transaction.note,
    amount: transaction.amount,
    type: transaction.transaction_type === "sale" ? "in" : "out",
    time: isPending ? "Just now" : formatRelativeDate(transaction.transaction_date),
    periods: getEntryPeriods(transaction.transaction_date),
    entryDate: transaction.transaction_date,
    source: "business",
    isUserAdded: isPending,
  };
};

export const buildKhataFeed = (
  khataEntries: LedgerEntry[],
  businessTransactions: BusinessTransaction[],
): LedgerEntry[] => {
  const businessEntries = businessTransactions.map(mapBusinessToLedgerEntry);

  return [...khataEntries, ...businessEntries].sort((a, b) => {
    const dateA = a.entryDate ?? "";
    const dateB = b.entryDate ?? "";
    if (dateA !== dateB) {
      return dateB.localeCompare(dateA);
    }
    return b.time.localeCompare(a.time);
  });
};

const mapKycStatus = (status: string): "Completed" | "Pending" =>
  status === "completed" ? "Completed" : "Pending";

export const mapVendorProfile = (profile: VendorProfile): VendorProfileView => ({
  name: profile.name,
  businessType: profile.business_type,
  initials: profile.name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join(""),
  upiId: profile.upi_id,
  businessHealthIndex: profile.business_health_index,
  aadhaar: {
    status: mapKycStatus(profile.aadhaar_status),
    value: profile.aadhaar_masked ?? "Not provided",
  },
  pan: {
    status: mapKycStatus(profile.pan_status),
    value: profile.pan_masked ?? "Not provided",
  },
  bank: {
    status: mapKycStatus(profile.bank_status),
    value: profile.bank_masked ?? "Not provided",
  },
  upi: {
    status: "Completed",
    value: profile.upi_id,
  },
  shopAddress: {
    status: mapKycStatus(profile.shop_address_status),
    value:
      profile.shop_address_status === "completed"
        ? "Verified shop address"
        : "Address proof needed",
  },
});

const reminderToneByCategory: Record<string, string> = {
  Inventory: "amber",
  Loans: "emerald",
  Khata: "rose",
  Compliance: "sky",
  Payments: "emerald",
};

export const mapReminder = (reminder: Reminder): ReminderItem => ({
  id: reminder.id,
  title: reminder.title,
  description: reminder.description,
  tag: reminder.category,
  tone: reminderToneByCategory[reminder.category] ?? "amber",
});

export const mapLoanOffer = (offer: LoanOffer): LoanOfferItem => ({
  id: offer.id,
  name: offer.name,
  amount: formatRupees(Number(offer.amount)),
  tenure: `${offer.tenure_days} days`,
  rate: `${offer.monthly_rate}% monthly`,
  minScore: offer.min_business_health_index,
});

export const mapInventoryItem = (item: InventoryItem): InventoryRow => ({
  id: item.id,
  label: item.item_name,
  quantity: Number(item.quantity),
  unit: item.unit,
  value: `${Number(item.quantity).toLocaleString("en-IN")} ${item.unit}`,
});

export const mapBusinessTransaction = (
  record: BusinessTransactionRecord,
): BusinessTransaction => ({
  id: record.id,
  transaction_type: record.transaction_type,
  amount: Number(record.amount),
  note: record.note,
  transaction_date: record.transaction_date,
});

export const computeHomeStatsFromBusiness = (
  transactions: BusinessTransaction[],
): HomeStats => {
  const monthTransactions = transactions.filter((transaction) =>
    getEntryPeriods(transaction.transaction_date).includes("month"),
  );

  return {
    sales: monthTransactions
      .filter((transaction) => transaction.transaction_type === "sale")
      .reduce((total, transaction) => total + transaction.amount, 0),
    expenses: monthTransactions
      .filter((transaction) => transaction.transaction_type === "expense")
      .reduce((total, transaction) => total + transaction.amount, 0),
  };
};

const computeCustomerBalance = (
  customer: CustomerRecord,
  entries: KhataEntry[],
) => {
  const customerEntries = entries.filter(
    (entry) => entry.customer_name === customer.name,
  );
  const moneyOut = customerEntries
    .filter((entry) => entry.entry_type === "money_out")
    .reduce((total, entry) => total + Number(entry.amount), 0);
  const moneyIn = customerEntries
    .filter((entry) => entry.entry_type === "money_in")
    .reduce((total, entry) => total + Number(entry.amount), 0);

  return Number(customer.opening_balance) + moneyOut - moneyIn;
};

export const mapCustomers = (
  customers: CustomerRecord[],
  entries: KhataEntry[],
): Customer[] =>
  customers.map((customer) => {
    const customerEntries = entries.filter(
      (entry) => entry.customer_name === customer.name,
    );
    const latestEntry = customerEntries[0];
    const balance = computeCustomerBalance(customer, entries);

    return {
      name: customer.name,
      phone: customer.phone ?? customer.upi_id ?? "",
      balance,
      status: balance > 0 ? "Due" : balance < 0 ? "Advance" : "Settled",
      lastEntry: latestEntry?.note ?? "No entries yet",
      date: latestEntry
        ? formatRelativeDate(latestEntry.entry_date)
        : "No activity",
    };
  });

export const computeKhataOverview = (entries: LedgerEntry[]): KhataOverview => {
  const monthEntries = entries.filter((entry) =>
    entry.periods.includes("month"),
  );
  const moneyIn = monthEntries
    .filter((entry) => entry.type === "in")
    .reduce((total, entry) => total + entry.amount, 0);
  const moneyOut = monthEntries
    .filter((entry) => entry.type === "out")
    .reduce((total, entry) => total + entry.amount, 0);

  return {
    moneyIn: formatRupees(moneyIn),
    moneyOut: formatRupees(moneyOut),
    cashFlow: formatRupees(moneyIn - moneyOut),
  };
};

export const getEligibleLoanAmount = (
  offers: LoanOfferItem[],
  businessHealthIndex: number,
) => {
  const eligible = offers.filter(
    (offer) => businessHealthIndex >= offer.minScore,
  );

  if (eligible.length === 0) {
    return "Rs 0";
  }

  return eligible[0].amount;
};

export const mapHomeAlerts = (reminders: ReminderItem[]): HomeAlert[] =>
  reminders.slice(0, 3).map((reminder) => ({ text: reminder.title }));

export const computeTotalReceivable = (customers: Customer[]) =>
  customers
    .filter((customer) => customer.balance > 0)
    .reduce((total, customer) => total + customer.balance, 0);
