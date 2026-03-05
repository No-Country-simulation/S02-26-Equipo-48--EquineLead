import type { LucideIcon } from "lucide-react";
import Tooltip from "./Tooltip";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  helpText?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-indigo-400",
  helpText,
}: StatCardProps) {
  return (
    <div className="relative bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg flex items-start gap-4 hover:border-slate-600 transition-colors">
      {helpText && (
        <div className="absolute top-4 right-4 outline-none">
          <Tooltip content={helpText} />
        </div>
      )}
      <div className={`p-3 rounded-xl bg-slate-700 ${iconColor}`}>
        <Icon size={22} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-400 font-medium">{title}</p>
        <p className="text-2xl font-bold mt-1 text-white truncate">{value}</p>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}