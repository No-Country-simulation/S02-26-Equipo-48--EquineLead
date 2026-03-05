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

      // Capturar total de leads ANTES de sincronizar
      const leadsBefore = metrics?.totalLeads ?? 0;

      pushToast("Iniciando sincronización de leads desde Tierragro...", "info");

      // Agregar entrada provisional al historial mientras procesa
      const pendingId = Date.now().toString();
      const pendingEvent: SyncEvent = {
        id: pendingId,
        timestamp: new Date().toISOString(),
        status: "pending",
        message: "Sincronización en curso...",
      };
      setSyncHistory(prev => {
        const updated = [pendingEvent, ...prev];
        saveHistory(updated);
        return updated;
      });

      await syncLeads();

      pushToast("Scrapper activo. Calculando nuevos leads en 10 segundos...", "info");

      // Esperar a que el scrapper termine (ajustar según MAX_PRODUCTS * SCRAP_DELAY)
      setTimeout(async () => {
        try {
          const afterRes = await getDashboardMetrics();
          const leadsAfter = afterRes.data.totalLeads;
          const delta = leadsAfter - leadsBefore;

          const message =
            delta === 0
              ? "Sincronización completada: 0 leads nuevos (sin cambios)"
              : `Sincronización completada: ${delta} lead${delta !== 1 ? "s" : ""} nuevo${delta !== 1 ? "s" : ""} agregado${delta !== 1 ? "s" : ""}`;

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
                ? { ...ev, status: "error" as const, message: "No se pudo verificar el resultado de la sincronización." }
                : ev
            );
            saveHistory(updated);
            return updated;
          });
        }
      }, 10000); // 10s — ajustar según tiempo de scraping

    } catch (err) {
      console.error("Sync failed", err);
      pushToast("No se pudo conectar al scrapper. Verifica que esté activo en el puerto 8081.", "error");
      addHistoryEvent("error", "Error de conexión al scrapper (puerto 8081 no disponible).");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      if (!metrics) return;

      pushToast("Generando reporte ejecutivo con datos actualizados...", "info");

      // Obtener Top Leads para el reporte
      const topLeadsRes = await getTopLeads(10);

      generateLeadReport(metrics, interactionData, funnelData, topLeadsRes.data);
      pushToast("Reporte PDF ejecutivo descargado correctamente.", "success");
    } catch (err) {
      console.error("Report generation failed", err);
      pushToast("No se pudo generar el reporte PDF profesional.", "error");
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
            <h1 className="text-3xl font-bold text-white">Analíticas de Crecimiento</h1>
            <p className="text-slate-400 mt-1">Métricas en tiempo real para análisis de flujo y valor</p>
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
              <span>{isSyncing ? "Sincronizando..." : "Sincronizar Leads"}</span>
            </button>

            {/* History button */}
            <button
              onClick={() => setHistoryOpen(true)}
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2.5 rounded-xl transition text-slate-300 relative"
              title="Ver historial de sincronizaciones"
            >
              <History size={18} />
              <span>Historial</span>
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
              <span>Descargar Reporte PDF</span>
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
          <StatCard
            title="Total Registrados"
            value={metrics.totalLeads.toLocaleString()}
            subtitle="Base total en CRM"
            icon={Users}
            iconColor="text-sky-400"
            helpText="Volumen acumulado de todos los prospectos capturados en el ecosistema EquineLead. Consolida tanto la base histórica del CRM como los nuevos ingresos capturados en tiempo real por el motor de scrapping."
          />
          <StatCard
            title="Valor del Pipeline"
            value={formatPipelineValue(metrics.pipelineValue)}
            subtitle="Suma presupuestos SQL (Hot) — USD"
            icon={HandCoins}
            iconColor="text-emerald-400"
            helpText="Representa la suma proyectada de los presupuestos de todos los leads actualmente clasificados como 'Hot'. Es una proyección del valor monetario (en USD) listo para ser gestionado por su alta probabilidad de conversión."
          />
          <StatCard
            title="Tasa de Cierre Global"
            value={`${metrics.winRate}% `}
            subtitle="Conversión SQL a Ganado"
            icon={PercentCircle}
            iconColor="text-rose-400"
            helpText="Refleja el porcentaje histórico de efectividad en el cierre de negocios. Indica cuánto de los leads calificados que ingresaron al embudo terminaron exitosamente en una transacción."
          />
          <StatCard
            title="Score Promedio"
            value={metrics.averageScore}
            subtitle="Calidad base (0–100)"
            icon={Target}
            iconColor="text-indigo-400"
            helpText="Es la calificación promedio de calidad (escala 0-100) de toda tu base de datos, evaluada por nuestro motor de Data Science. Un promedio alto indica leads alineados a tu catálogo premium."
          />
          <StatCard
            title="Leads Hot"
            value={`${metrics.effectivity}% `}
            subtitle="Proporción sobre el total"
            icon={TrendingUp}
            iconColor="text-amber-400"
            helpText="Muestra la proporción porcentual de leads identificados por la IA con una intención de compra crítica. Prospectos que han superado los umbrales de presupuesto y actividad necesarios para prioridad máxima."
          />
        </div>

        {/* Gráficos Primera Fila */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 border border-slate-700 bg-slate-800 rounded-2xl overflow-hidden p-1">
            <UserDistributionChart
              data={leadTypesData}
              helpText="Desglose de la base de datos entre B2B (Empresas) y B2C (Consumidores finales). Fundamental para ajustar el discurso comercial y entender los ciclos de venta."
            />
          </div>
          <div className="lg:col-span-2">
            <CustomFunnel
              data={funnelData}
              helpText="Visualización del viaje del cliente desde la captura hasta el cierre. Permite detectar puntos de fuga y cuellos de botella en el proceso de ventas."
            />
          </div>
        </div>

        {/* Gráficos Segunda Fila */}
        <div className="grid grid-cols-1 gap-6">
          <InteractionChart
            data={interactionData}
            helpText="Identifica el origen de los leads y sus canales de interacción preferidos. Brújula para optimizar la inversión en publicidad y marketing."
          />
          <ClassificationChart
            data={classificationData}
            helpText="Tendencia histórica de la calidad de leads. Permite visualizar si el volumen de prospectos 'Calientes' aumenta con el tiempo gracias a las estrategias de nutrición."
          />
        </div>
      </div>
    </>
  );
}
