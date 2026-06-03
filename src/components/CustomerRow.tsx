import { ChevronRight } from "lucide-react";

interface CustomerRowProps {
  name: string;
  phone: string;
  balance: number;
  status: string;
  lastEntry: string;
  date: string;
}

export const CustomerRow = ({
  name,
  phone,
  balance,
  status,
  lastEntry,
  date,
}: CustomerRowProps) => {
  const isDue = balance > 0;

  return (
    <button className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 p-3 text-left">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-base font-black text-slate-700">
        {name
          .split(" ")
          .map((word) => word[0])
          .slice(0, 2)
          .join("")}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate font-bold">{name}</p>
          <p
            className={`shrink-0 text-sm font-black ${
              isDue ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            Rs {Math.abs(balance).toLocaleString("en-IN")}
          </p>
        </div>
        <p className="truncate text-xs text-slate-500">{phone}</p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="truncate text-xs text-slate-600">{lastEntry}</p>
          <span
            className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-bold ${
              isDue
                ? "bg-rose-50 text-rose-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {status}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 text-slate-400">
        <ChevronRight size={18} />
        <span className="text-[11px]">{date}</span>
      </div>
    </button>
  );
};
