interface StatCardProps {
  title: string;
  value: string;
  bg: string;
}

export const StatCard = ({ title, value, bg }: StatCardProps) => (
  <div className={`${bg} rounded-xl p-3 text-center`}>
    <p className="text-sm text-gray-500">{title}</p>
    <h3 className="text-lg font-bold">{value}</h3>
  </div>
);
