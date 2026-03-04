import {
  FunnelChart as RechartsFunnelChart,
  Funnel,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type { FunnelData } from "../../services/api";

interface Props {
  data: FunnelData[];
}

export default function CustomFunnel({ data }: Props) {
  if (!Array.isArray(data)) return null;

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
      <h2 className="mb-4 text-lg font-semibold">Interactions Funnel</h2>

      <ResponsiveContainer width="100%" height={300}>
        <RechartsFunnelChart>
          <Tooltip />
          <Funnel dataKey="value" data={data} isAnimationActive />
        </RechartsFunnelChart>
      </ResponsiveContainer>
    </div>
  );
}