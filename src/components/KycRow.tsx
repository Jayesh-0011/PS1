import { CheckCircle, XCircle } from "lucide-react";
import { useLanguage } from "../lib/i18n";

interface KycRowProps {
  label: string;
  status: "Completed" | "Pending";
  value: string;
}

export const KycRow = ({ label, status, value }: KycRowProps) => {
  const { t } = useLanguage();
  const isCompleted = status === "Completed";

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          isCompleted
            ? "bg-emerald-50 text-emerald-700"
            : "bg-amber-50 text-amber-700"
        }`}
      >
        {isCompleted ? <CheckCircle size={20} /> : <XCircle size={20} />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold">{label}</p>
        <p className="truncate text-sm text-slate-500">{value}</p>
      </div>
      <span
        className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
          isCompleted
            ? "bg-emerald-100 text-emerald-700"
            : "bg-amber-100 text-amber-700"
        }`}
      >
        {t(status)}
      </span>
    </div>
  );
};
