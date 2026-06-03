import type { ReactNode } from "react";

interface NavItemProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

export const NavItem = ({
  icon,
  label,
  active = false,
  onClick,
}: NavItemProps) => (
  <button
    onClick={onClick}
    type="button"
    className={`flex min-w-0 flex-col items-center gap-1 text-xs font-semibold ${
      active ? "text-emerald-700" : "text-slate-500"
    }`}
  >
    {icon}
    <span className="truncate">{label}</span>
  </button>
);
