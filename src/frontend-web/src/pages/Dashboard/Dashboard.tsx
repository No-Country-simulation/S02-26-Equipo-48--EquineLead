import { useEffect, useState } from "react";
import {
  getDashboardMetrics,
  getInteractionSources,
  getFunnelData,
  getClassificationEvolution,
  getLeadTypes,
  downloadReport,
  syncLeads,
} from "../../services/api";
import type {
  DashboardMetrics,
  InteractionSource,
  FunnelData,
  ClassificationData,
  LeadTypeData
} from "../../services/api";

import StatCard from "../../components/ui/StatCard";
import InteractionChart from "../../components/ui/InteractionChart";
import CustomFunnel from "../../components/ui/FunnelChart";
import ClassificationChart from "../../components/ui/ClassificationChart";
import UserDistributionChart from "../../components/ui/UserDistributionChart";
import { Loader2, AlertCircle, FileDown, Target, Users, TrendingUp, HandCoins, PercentCircle } from "lucide-react";

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [interactionData, setInteractionData] = useState<InteractionSource[]>([]);
  const [funnelData, setFunnelData] = useState<FunnelData[]>([]);
  const [classificationData, setClassificationData] = useState<ClassificationData[]>([]);
  const [leadTypesData, setLeadTypesData] = useState<LeadTypeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [mRes, iRes, fRes, cRes, ltRes] = await Promise.all([
        getDashboardMetrics(),
        getInteractionSources(),
        getFunnelData(),
        getClassificationEvolution(),
        getLeadTypes()
      ]);

      setMetrics(mRes.data);
      setInteractionData(iRes.data);
      setFunnelData(fRes.data);
      setClassificationData(cRes.data);
      setLeadTypesData(ltRes.data);
      setError(null);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
      setError("No se pudo conectar al API. Asegúrate de que el backend esté activo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      await syncLeads();
      alert("Sincronización iniciada en segundo plano. Los nuevos leads aparecerán pronto.");
      // Opcional: recargar datos después de un momento
      setTimeout(loadData, 5000);
    } catch (err) {
      console.error("Sync failed", err);
      alert("No se pudo iniciar la sincronización. Verifica que el scrapper esté activo en el puerto 8081.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await downloadReport();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "equine-lead-report.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Report download failed", err);
      alert("No se pudo descargar el reporte. Verifica la conexión con el backend.");
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-indigo-500 w-12 h-12" />
        <p className="text-slate-400 font-medium tracking-wide">Analizando Leads y Métricas...</p>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="text-red-500 w-16 h-16" />
        <h2 className="text-2xl font-bold">Error de Conexión</h2>
        <p className="text-slate-400 max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-xl transition font-medium"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Format pipeline value manually for cleaner display ($4.5M instead of $4500000)
  const formatPipelineValue = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)} M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(1)} k`;
    return `$${val} `;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Analíticas de Crecimiento</h1>
          <p className="text-slate-400 mt-1">Métricas en tiempo real para análisis de flujo y valor</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl transition font-medium border ${isSyncing
                ? "bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
              }`}
          >
            {isSyncing ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <TrendingUp size={18} />
            )}
            <span>{isSyncing ? "Sincronizando..." : "Sincronizar Leads"}</span>
          </button>

          <button
            onClick={handleDownloadReport}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-5 py-2.5 rounded-xl transition text-slate-200"
          >
            <FileDown size={18} />
            <span>Descargar Reporte PDF</span>
          </button>
        </div>
      </div>

      {/* Stat Cards - Analista (5 tarjetas clave) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
        <StatCard
          title="Total Registrados"
          value={metrics.totalLeads.toLocaleString()}
          subtitle="Base total en CRM"
          icon={Users}
          iconColor="text-sky-400"
        />
        <StatCard
          title="Valor del Pipeline"
          value={formatPipelineValue(metrics.pipelineValue)}
          subtitle="Suma prespuestos SQL (Hot)"
          icon={HandCoins}
          iconColor="text-emerald-400"
        />
        <StatCard
          title="Tasa de Cierre Global"
          value={`${metrics.winRate}% `}
          subtitle="Conversión SQL a Ganado"
          icon={PercentCircle}
          iconColor="text-rose-400"
        />
        <StatCard
          title="Score Promedio"
          value={metrics.averageScore}
          subtitle="Calidad base (0–100)"
          icon={Target}
          iconColor="text-indigo-400"
        />
        <StatCard
          title="Leads Hot"
          value={`${metrics.effectivity}% `}
          subtitle="Proporción sobre el total"
          icon={TrendingUp}
          iconColor="text-amber-400"
        />
      </div>

      {/* Gráficos Primera Fila (Donut + Funnel + Fuentes) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 border border-slate-700 bg-slate-800 rounded-2xl overflow-hidden p-1">
          <UserDistributionChart data={leadTypesData} />
        </div>
        <div className="lg:col-span-2">
          <CustomFunnel data={funnelData} />
        </div>
      </div>

      {/* Gráficos Segunda Fila */}
      <div className="grid grid-cols-1 gap-6">
        <InteractionChart data={interactionData} />
        <ClassificationChart data={classificationData} />
      </div>
    </div>
  );
}
