import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { ClassificationData } from "../../services/api";
import Tooltip from "./Tooltip";
import { useTranslation } from "react-i18next";

interface Props {
  data: ClassificationData[];
  helpText?: string;
}

const CustomTooltip = ({ active, payload, label, t }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm shadow-xl">
        <p className="font-semibold text-white mb-2 pb-2 border-b border-slate-700">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry: any) => (
            <div key={entry.name} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {t(`dashboard.charts.classification.temperatures.${entry.name}`, { defaultValue: entry.name })}:
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

export default function ClassificationChart({ data, helpText }: Props) {
  const { t } = useTranslation();

  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg relative">
      <div className="mb-6 pr-8">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-white">{t("dashboard.charts.classification.title")}</h2>
          {helpText && <Tooltip content={helpText} />}
        </div>
        <p className="text-xs text-slate-400 mt-1">{t("dashboard.charts.classification.subtitle")}</p>
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
          <RechartsTooltip content={<CustomTooltip t={t} />} />
          <Legend
            iconType="circle"
            formatter={(value) => t(`dashboard.charts.classification.temperatures.${value}`, { defaultValue: value })}
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