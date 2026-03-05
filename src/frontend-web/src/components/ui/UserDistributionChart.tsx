import {
    PieChart,
    Pie,
    Cell,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import type { LeadTypeData } from "../../services/api";
import Tooltip from "./Tooltip";

interface Props {
    data: LeadTypeData[];
    helpText?: string;
}

// Colores acordados: Indigo corporativo (B2B) y Cian vibrante (B2C)
const COLORS = ["#06b6d4", "#4f46e5"];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const item = payload[0].payload;
        // Asumimos que la suma total es de 100k para el porcentaje, 
        // pero idealmente se pasaría el total o se calcularía. 
        // Para simplificar, obtenemos el total reduciendo el array si estuviera disponible.
        // Como Recharts no lo pasa fácil al payload de Pie, pasamos el `value`.
        return (
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm shadow-xl">
                <p className="font-semibold text-white mb-1">{item.name}</p>
                <p className="text-slate-300">
                    Cantidad: <span className="font-bold text-white">{item.value.toLocaleString()}</span>
                </p>
            </div>
        );
    }
    return null;
};

export default function UserDistributionChart({ data, helpText }: Props) {
    if (!Array.isArray(data) || data.length === 0) return null;

    return (
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg flex flex-col h-full relative">
            <div className="mb-4 pr-8">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-white">Distribución de Usuarios</h2>
                    {helpText && <Tooltip content={helpText} />}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                    Proporción entre empresas (B2B) e individuos (B2C)
                </p>
            </div>

            <div className="flex-grow min-h-[250px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
