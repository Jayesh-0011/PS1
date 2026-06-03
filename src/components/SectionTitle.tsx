interface SectionTitleProps {
  title: string;
  action: string;
}

export const SectionTitle = ({ title, action }: SectionTitleProps) => (
  <div className="mb-3 mt-6 flex items-center justify-between">
    <h2 className="text-base font-black">{title}</h2>
    <button className="text-sm font-bold text-emerald-700">{action}</button>
  </div>
);
