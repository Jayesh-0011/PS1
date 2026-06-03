import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

interface ProfileActionRowProps {
  icon: ReactNode;
  label: string;
  value: string;
  onClick?: () => void;
}

export const ProfileActionRow = ({
  icon,
  label,
  value,
  onClick,
}: ProfileActionRowProps) => (
  <button
    className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 p-4 text-left"
    onClick={onClick}
    type="button"
  >
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="truncate font-bold">{label}</p>
      <p className="text-sm text-slate-500">{value}</p>
    </div>
    <ChevronRight className="shrink-0 text-slate-400" size={18} />
  </button>
);
