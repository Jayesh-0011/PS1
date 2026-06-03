import type { KhataFilter, LedgerEntry } from "../types";

const formatRupees = (value: number) => `Rs ${value.toLocaleString("en-IN")}`;

export const computeKhataSummaryFromEntries = (
  entries: LedgerEntry[],
  filter: KhataFilter,
) => {
  const filtered = entries.filter((entry) => entry.periods.includes(filter));
  const moneyIn = filtered
    .filter((entry) => entry.type === "in")
    .reduce((total, entry) => total + entry.amount, 0);
  const moneyOut = filtered
    .filter((entry) => entry.type === "out")
    .reduce((total, entry) => total + entry.amount, 0);

  return {
    receivable: (moneyOut - moneyIn).toLocaleString("en-IN"),
    moneyIn: formatRupees(moneyIn),
    moneyOut: formatRupees(moneyOut),
  };
};
