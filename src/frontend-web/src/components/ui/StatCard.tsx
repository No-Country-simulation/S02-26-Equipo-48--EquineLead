interface StatCardProps {
  title: string;
  value: string | number;
  percentage: string;
  positive?: boolean;
}

export default function StatCard({
  title,
  value,
  percentage,
  positive = true,
}: StatCardProps) {
  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
      <h3 className="text-gray-400">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
      <p className={`mt-2 ${positive ? "text-green-400" : "text-red-400"}`}>
        {percentage}
      </p>
    </div>
  );
}