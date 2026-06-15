interface LoanCardProps {
  name: string;
  amount: string;
  tenure: string;
  rate: string;
  minScore: number;
  businessHealthIndex: number;
}

const LoanInfo = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl bg-slate-100 p-2">
    <p className="text-[11px] font-semibold text-slate-500">{label}</p>
    <p className="mt-1 text-xs font-black">{value}</p>
  </div>
);

export const LoanCard = ({
  name,
  amount,
  tenure,
  rate,
  minScore,
  businessHealthIndex,
}: LoanCardProps) => {
  const { t } = useLanguage();
  const isEligible = businessHealthIndex >= minScore;

  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-black">{name}</h3>
          <p className="mt-1 text-sm text-slate-500">{t("Minimum index")}: {minScore}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
            isEligible
              ? "bg-emerald-100 text-emerald-700"
              : "bg-rose-100 text-rose-700"
          }`}
        >
          {isEligible ? t("Eligible") : t("Not eligible")}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <LoanInfo label={t("Amount")} value={amount} />
        <LoanInfo label={t("Tenure")} value={tenure} />
        <LoanInfo label={t("Rate")} value={rate} />
      </div>
    </div>
  );
};
import { useLanguage } from "../lib/i18n";
