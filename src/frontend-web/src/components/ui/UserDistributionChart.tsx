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
import { useTranslation } from "react-i18next";

interface Props {
    data: LeadTypeData[];
    helpText?: string;
}

// Colores acordados: Indigo corporativo (B2B) y Cian vibrante (B2C)
const COLORS = ["#06b6d4", "#4f46e5"];

const CustomTooltip = ({ active, payload, t }: any) => {
    if (active && payload && payload.length) {
        const item = payload[0].payload;
        return (
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm shadow-xl">
                <p className="font-semibold text-white mb-1">{item.name}</p>
                <p className="text-slate-300">
                    {t("dashboard.charts.userDistribution.quantity")}: <span className="font-bold text-white">{item.value.toLocaleString()}</span>
                </p>
            </div>
        );
    }
    return null;
};

export default function UserDistributionChart({ data, helpText }: Props) {
    const { t } = useTranslation();
    if (!Array.isArray(data) || data.length === 0) return null;

    return (
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg flex flex-col h-full relative">
            <div className="mb-4 pr-8">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-white">{t("dashboard.charts.userDistribution.title")}</h2>
                    {helpText && <Tooltip content={helpText} />}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                    {t("dashboard.charts.userDistribution.subtitle")}
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
                        <RechartsTooltip content={<CustomTooltip t={t} />} />
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
