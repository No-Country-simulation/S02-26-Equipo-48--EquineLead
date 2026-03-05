import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { ClassificationData } from "../../services/api";

interface Props {
  data: ClassificationData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm shadow-xl">
        <p className="font-semibold text-white mb-2 pb-2 border-b border-slate-700">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry: any) => (
            <div key={entry.name} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name === "cold" ? "Frío" : entry.name === "warm" ? "Tibio" : "Caliente"}:
              </span>
              <span className="font-bold text-white text-right">
                {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function ClassificationChart({ data }: Props) {
  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">Evolución de Clasificación</h2>
        <p className="text-xs text-slate-400 mt-1">Tendencia histórica de leads por temperatura</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#64748b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorWarm" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorHot" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            formatter={(value) =>
              value === "cold" ? "Frío" : value === "warm" ? "Tibio" : "Caliente"
            }
            wrapperStyle={{ fontSize: "13px", paddingTop: "20px" }}
          />
          <Area
            type="monotone"
            dataKey="cold"
            stackId="1"
            stroke="#64748b"
            fillOpacity={1}
            fill="url(#colorCold)"
          />
          <Area
            type="monotone"
            dataKey="warm"
            stackId="1"
            stroke="#f59e0b"
            fillOpacity={1}
            fill="url(#colorWarm)"
          />
          <Area
            type="monotone"
            dataKey="hot"
            stackId="1"
            stroke="#f43f5e"
            fillOpacity={1}
            fill="url(#colorHot)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}