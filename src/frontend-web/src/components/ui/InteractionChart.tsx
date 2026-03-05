import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import type { InteractionSource } from "../../services/api";

interface Props {
  data: InteractionSource[];
}

const SOURCE_COLORS: Record<string, string> = {
  Facebook: "#818cf8",   // indigo
  Instagram: "#f472b6",  // pink
  Formulario: "#34d399",  // emerald
  Web: "#38bdf8",         // sky
  Evento: "#fb923c",      // orange
  Otro: "#94a3b8",        // slate
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm shadow-xl">
        <p className="font-semibold text-white mb-1">{label}</p>
        <p style={{ color: payload[0].fill }}>
          Interacciones: <span className="font-bold">{payload[0].value.toLocaleString()}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function InteractionChart({ data }: Props) {
  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">Fuente de Interacciones</h2>
        <p className="text-xs text-slate-400 mt-1">Distribución de leads por canal de origen</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barCategoryGap="30%">
          <XAxis dataKey="source" tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
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