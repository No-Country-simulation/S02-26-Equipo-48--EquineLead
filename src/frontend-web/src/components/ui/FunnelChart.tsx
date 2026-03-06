import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import type { FunnelData } from "../../services/api";
import Tooltip from "./Tooltip";
import { useTranslation } from "react-i18next";

interface Props {
  data: FunnelData[];
  helpText?: string;
}

// Escala monocromática de Indigo para representar el flujo sin confundir con otros gráficos
const INDIGO_SHADES = [
  "#4338ca", // indigo-700
  "#4f46e5", // indigo-600
  "#6366f1", // indigo-500
  "#818cf8", // indigo-400
  "#a5b4fc", // indigo-300
];

const CustomTooltip = ({ active, payload, t }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm shadow-xl">
        <p className="font-semibold text-white mb-1">{item.name}</p>
        <p className="text-slate-300">
          {t("dashboard.charts.funnel.quantity")}: <span className="font-bold text-white">{item.value.toLocaleString()}</span>
        </p>
        {(payload[0] as any).chartData && (
          <p className="text-indigo-400 text-xs mt-1 font-medium">
            {t("dashboard.charts.funnel.retention")}: {((item.value / (payload[0] as any).chartData[0].value) * 100).toFixed(1)}% {t("dashboard.charts.funnel.ofTotal")}
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function CustomFunnel({ data, helpText }: Props) {
  const { t } = useTranslation();
  if (!Array.isArray(data) || data.length === 0) return null;

  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg relative">
      <div className="mb-4 pr-8">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-white">{t("dashboard.charts.funnel.title")}</h2>
          {helpText && <Tooltip content={helpText} />}
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {t("dashboard.charts.funnel.subtitle")}
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            width={100}
          />
          <RechartsTooltip content={<CustomTooltip t={t} />} cursor={{ fill: "transparent" }} />
          <Bar
            dataKey="value"
            radius={[0, 4, 4, 0]}
            barSize={32}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={INDIGO_SHADES[index % INDIGO_SHADES.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}