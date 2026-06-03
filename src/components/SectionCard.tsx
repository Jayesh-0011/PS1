import type { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}

export const SectionCard = ({ title, icon, children }: SectionCardProps) => (
  <div className="mb-4 rounded-xl border bg-white p-4">
    <div className="mb-3 flex items-center gap-2">
      {icon}
      <h3 className="font-semibold">{title}</h3>
    </div>
    {children}
  </div>
);
