interface RowProps {
  label: string;
  value: string;
  bold?: boolean;
}

export const Row = ({ label, value, bold = false }: RowProps) => (
  <div className={`flex justify-between ${bold ? "font-bold" : ""}`}>
    <span>{label}</span>
    <span>{value}</span>
  </div>
);
