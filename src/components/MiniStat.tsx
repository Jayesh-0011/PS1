import type { ReactNode } from "react";

interface MiniStatProps {
  icon: ReactNode;
  label: string;
  value: string;
  tone: "green" | "red";
}

export const MiniStat = ({ icon, label, value, tone }: MiniStatProps) => {
  const toneClass =
    tone === "green"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-rose-50 text-rose-700";

  return (
    <div className={`rounded-xl p-3 ${toneClass}`}>
      <div className="flex items-center gap-2 text-xs font-semibold">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-base font-black">{value}</p>
    </div>
  );
};
