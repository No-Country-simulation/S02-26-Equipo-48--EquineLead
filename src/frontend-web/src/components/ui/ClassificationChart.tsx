import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ClassificationData } from "../../services/api";

interface Props {
  data: ClassificationData[];
}

export default function ClassificationChart({ data }: Props) {
  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
      <h2 className="mb-4 text-lg font-semibold">Classification Evolution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="cold" stackId="a" fill="#3b82f6" />
          <Bar dataKey="warm" stackId="a" fill="#facc15" />
          <Bar dataKey="hot" stackId="a" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}