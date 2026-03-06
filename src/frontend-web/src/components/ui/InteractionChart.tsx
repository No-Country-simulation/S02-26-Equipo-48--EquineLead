import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import type { InteractionSource } from "../../services/api";
import Tooltip from "./Tooltip";
import { useTranslation } from "react-i18next";

interface Props {
  data: InteractionSource[];
  helpText?: string;
}

const SOURCE_COLORS: Record<string, string> = {
  Facebook: "#818cf8",   // indigo
  Instagram: "#f472b6",  // pink
  Formulario: "#34d399",  // emerald
  Web: "#38bdf8",         // sky
  Evento: "#fb923c",      // orange
  Otro: "#94a3b8",        // slate
};

const CustomTooltip = ({ active, payload, label, t }: any) => {
  if (active && payload && payload.length) {
    const translatedLabel = t(`dashboard.charts.interaction.sources.${label}`, { defaultValue: label });
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm shadow-xl">
        <p className="font-semibold text-white mb-1">{translatedLabel}</p>
        <p style={{ color: payload[0].fill }}>
          {t("dashboard.charts.interaction.quantity")}: <span className="font-bold">{payload[0].value.toLocaleString()}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function InteractionChart({ data, helpText }: Props) {
  const { t } = useTranslation();

  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg relative">
      <div className="mb-4 pr-8">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-white">{t("dashboard.charts.interaction.title")}</h2>
          {helpText && <Tooltip content={helpText} />}
        </div>
        <p className="text-xs text-slate-400 mt-1">{t("dashboard.charts.interaction.subtitle")}</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barCategoryGap="30%">
          <XAxis
            dataKey="source"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            tickFormatter={(val) => t(`dashboard.charts.interaction.sources.${val}`, { defaultValue: val })}
          />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <RechartsTooltip content={<CustomTooltip t={t} />} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.source}
                fill={SOURCE_COLORS[entry.source] ?? "#94a3b8"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}