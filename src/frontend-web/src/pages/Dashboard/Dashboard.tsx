import { useEffect, useState, useCallback } from "react";
import {
  getDashboardMetrics,
  getInteractionSources,
  getFunnelData,
  getClassificationEvolution,
  getLeadTypes,
  getTopLeads,
  syncLeads,
} from "../../services/api";
import type {
  DashboardMetrics,
  InteractionSource,
  FunnelData,
  ClassificationData,
  LeadTypeData
} from "../../services/api";
import { generateLeadReport } from "../../services/reportGenerator";

import StatCard from "../../components/ui/StatCard";
import InteractionChart from "../../components/ui/InteractionChart";
import CustomFunnel from "../../components/ui/FunnelChart";
import ClassificationChart from "../../components/ui/ClassificationChart";
import UserDistributionChart from "../../components/ui/UserDistributionChart";
import Toast, { type ToastMessage, type ToastType } from "../../components/ui/Toast";
import SyncHistoryPanel, { type SyncEvent } from "../../components/ui/SyncHistoryPanel";
import { Loader2, AlertCircle, FileDown, Target, Users, TrendingUp, HandCoins, PercentCircle, History } from "lucide-react";
import { useTranslation } from "react-i18next";

const HISTORY_KEY = "sync_history_events";

function loadHistory(): SyncEvent[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(events: SyncEvent[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(events.slice(0, 50))); // cap at 50
}

export default function Dashboard() {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [interactionData, setInteractionData] = useState<InteractionSource[]>([]);
  const [funnelData, setFunnelData] = useState<FunnelData[]>([]);
  const [classificationData, setClassificationData] = useState<ClassificationData[]>([]);
  const [leadTypesData, setLeadTypesData] = useState<LeadTypeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Toast state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync history state
  const [historyOpen, setHistoryOpen] = useState(false);
  const [syncHistory, setSyncHistory] = useState<SyncEvent[]>(loadHistory);

  const pushToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addHistoryEvent = useCallback((status: SyncEvent["status"], message: string) => {
    const event: SyncEvent = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      status,
      message,
    };
    setSyncHistory(prev => {
      const updated = [event, ...prev];
      saveHistory(updated);
      return updated;
    });
  }, []);

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
      setError(t("common.errorMsg"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSync = async () => {
    if (isSyncing) return;
    try {
      setIsSyncing(true);

      // Capturar total de leads ANTES de sincronizar
      const leadsBefore = metrics?.totalLeads ?? 0;

      pushToast(t("dashboard.messages.syncStart"), "info");

      // Agregar entrada provisional al historial mientras procesa
      const pendingId = Date.now().toString();
      const pendingEvent: SyncEvent = {
        id: pendingId,
        timestamp: new Date().toISOString(),
        status: "pending",
        message: t("dashboard.syncHistory.pending"),
      };
      setSyncHistory(prev => {
        const updated = [pendingEvent, ...prev];
        saveHistory(updated);
        return updated;
      });

      await syncLeads();

      pushToast(t("dashboard.messages.syncActive"), "info");

      // Esperar a que el scrapper termine (ajustar según MAX_PRODUCTS * SCRAP_DELAY)
      setTimeout(async () => {
        try {
          const afterRes = await getDashboardMetrics();
          const leadsAfter = afterRes.data.totalLeads;
          const delta = leadsAfter - leadsBefore;

          const message =
            delta === 0
              ? t("dashboard.messages.syncNoChange")
              : t("dashboard.messages.syncComplete", { count: delta });

          // Actualizar la entrada pendiente con el resultado real
          setSyncHistory(prev => {
            const updated = prev.map(ev =>
              ev.id === pendingId
                ? { ...ev, status: "success" as const, message }
                : ev
            );
            saveHistory(updated);
            return updated;
          });

          pushToast(message, "success");
          setMetrics(afterRes.data); // refrescar métricas del dashboard
        } catch {
          setSyncHistory(prev => {
            const updated = prev.map(ev =>
              ev.id === pendingId
                ? { ...ev, status: "error" as const, message: t("dashboard.messages.syncVerifyError") }
                : ev
            );
            saveHistory(updated);
            return updated;
          });
        }
      }, 10000); // 10s — ajustar según tiempo de scraping

    } catch (err) {
      console.error("Sync failed", err);
      pushToast(t("dashboard.messages.syncError"), "error");
      addHistoryEvent("error", t("dashboard.syncHistory.connectionError"));
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      if (!metrics) return;

      pushToast(t("dashboard.messages.reportStart"), "info");

      // Obtener Top Leads para el reporte
      const topLeadsRes = await getTopLeads(10);

      generateLeadReport(metrics, interactionData, funnelData, topLeadsRes.data);
      pushToast(t("dashboard.messages.reportSuccess"), "success");
    } catch (err) {
      console.error("Report generation failed", err);
      pushToast(t("dashboard.messages.reportError"), "error");
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-indigo-500 w-12 h-12" />
        <p className="text-slate-400 font-medium tracking-wide">{t("common.loading")}</p>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="text-red-500 w-16 h-16" />
        <h2 className="text-2xl font-bold">{t("common.errorTitle")}</h2>
        <p className="text-slate-400 max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-xl transition font-medium"
        >
          {t("common.retry")}
        </button>
      </div>
    );
  }

  const formatPipelineValue = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)} M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(1)} k`;
    return `$${val} `;
  };

  return (
    <>
      {/* Toast container — fixed, top-right, floats above everything */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Sync History Panel — slide-in from right */}
      <SyncHistoryPanel
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        events={syncHistory}
        onClear={() => {
          setSyncHistory([]);
          saveHistory([]);
        }}
      />

      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{t("dashboard.title")}</h1>
            <p className="text-slate-400 mt-1">{t("dashboard.subtitle")}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Sync button */}
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
              <span>{isSyncing ? t("dashboard.syncing") : t("dashboard.syncBtn")}</span>
            </button>

            {/* History button */}
            <button
              onClick={() => setHistoryOpen(true)}
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2.5 rounded-xl transition text-slate-300 relative"
              title={t("dashboard.history")}
            >
              <History size={18} />
              <span>{t("dashboard.history")}</span>
              {syncHistory.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-indigo-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {syncHistory.length > 9 ? "9+" : syncHistory.length}
                </span>
              )}
            </button>

            {/* Download report button */}
            <button
              onClick={handleDownloadReport}
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-5 py-2.5 rounded-xl transition text-slate-200"
            >
              <FileDown size={18} />
              <span>{t("dashboard.reportBtn")}</span>
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
          <StatCard
            title={t("dashboard.stats.total.title")}
            value={metrics.totalLeads.toLocaleString()}
            subtitle={t("dashboard.stats.total.subtitle")}
            icon={Users}
            iconColor="text-sky-400"
            helpText={t("dashboard.stats.total.help")}
          />
          <StatCard
            title={t("dashboard.stats.pipeline.title")}
            value={formatPipelineValue(metrics.pipelineValue)}
            subtitle={t("dashboard.stats.pipeline.subtitle")}
            icon={HandCoins}
            iconColor="text-emerald-400"
            helpText={t("dashboard.stats.pipeline.help")}
          />
          <StatCard
            title={t("dashboard.stats.winRate.title")}
            value={`${metrics.winRate}% `}
            subtitle={t("dashboard.stats.winRate.subtitle")}
            icon={PercentCircle}
            iconColor="text-rose-400"
            helpText={t("dashboard.stats.winRate.help")}
          />
          <StatCard
            title={t("dashboard.stats.score.title")}
            value={metrics.averageScore}
            subtitle={t("dashboard.stats.score.subtitle")}
            icon={Target}
            iconColor="text-indigo-400"
            helpText={t("dashboard.stats.score.help")}
          />
          <StatCard
            title={t("dashboard.stats.hotLeads.title")}
            value={`${metrics.effectivity}% `}
            subtitle={t("dashboard.stats.hotLeads.subtitle")}
            icon={TrendingUp}
            iconColor="text-amber-400"
            helpText={t("dashboard.stats.hotLeads.help")}
          />
        </div>

        {/* Gráficos Primera Fila */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 border border-slate-700 bg-slate-800 rounded-2xl overflow-hidden p-1">
            <UserDistributionChart
              data={leadTypesData}
              helpText={t("dashboard.charts.userDistribution.help")}
            />
          </div>
          <div className="lg:col-span-2">
            <CustomFunnel
              data={funnelData}
              helpText={t("dashboard.charts.funnel.help")}
            />
          </div>
        </div>

        {/* Gráficos Segunda Fila */}
        <div className="grid grid-cols-1 gap-6">
          <InteractionChart
            data={interactionData}
            helpText={t("dashboard.charts.interaction.help")}
          />
          <ClassificationChart
            data={classificationData}
            helpText={t("dashboard.charts.classification.help")}
          />
        </div>
      </div>
    </>
  );
}
