import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

interface EntryRowProps {
  label: string;
  note: string;
  amount: number;
  type: string;
  time: string;
  isLast: boolean;
}

export const EntryRow = ({
  label,
  note,
  amount,
  type,
  time,
  isLast,
}: EntryRowProps) => {
  const isMoneyIn = type === "in";

  return (
    <div
      className={`flex items-center gap-3 px-3 py-3 ${
        isLast ? "" : "border-b border-slate-200"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          isMoneyIn
            ? "bg-emerald-50 text-emerald-600"
            : "bg-rose-50 text-rose-600"
        }`}
      >
        {isMoneyIn ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold">{label}</p>
        <p className="truncate text-xs text-slate-500">{note}</p>
      </div>
      <div className="shrink-0 text-right">
        <p
          className={`text-sm font-black ${
            isMoneyIn ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {isMoneyIn ? "+" : "-"} Rs {amount.toLocaleString("en-IN")}
        </p>
        <p className="text-xs text-slate-500">{time}</p>
      </div>
    </div>
  );
};
