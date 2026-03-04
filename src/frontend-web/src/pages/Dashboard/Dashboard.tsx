import { useEffect, useState } from "react";
import {
  getDashboardMetrics,
  getInteractionSources,
  getFunnelData,
  getClassificationEvolution,
  downloadReport,
} from "../../services/api";
import type {
  DashboardMetrics,
  InteractionSource,
  FunnelData,
  ClassificationData
} from "../../services/api";

import StatCard from "../../components/ui/StatCard";
import InteractionChart from "../../components/ui/InteractionChart";
import CustomFunnel from "../../components/ui/FunnelChart";
import ClassificationChart from "../../components/ui/ClassificationChart";
import { Loader2, AlertCircle, FileDown } from "lucide-react";

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [interactionData, setInteractionData] = useState<InteractionSource[]>([]);
  const [funnelData, setFunnelData] = useState<FunnelData[]>([]);
  const [classificationData, setClassificationData] = useState<ClassificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [mRes, iRes, fRes, cRes] = await Promise.all([
          getDashboardMetrics(),
          getInteractionSources(),
          getFunnelData(),
          getClassificationEvolution()
        ]);

        setMetrics(mRes.data);
        setInteractionData(iRes.data);
        setFunnelData(fRes.data);
        setClassificationData(cRes.data);
        setError(null);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
        setError("Could not connect to the API. Please ensure the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
      alert("Failed to download report. Check backend connection.");
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-500 w-12 h-12" />
        <p className="text-slate-400 font-medium tracking-wide">Analysing Leads & Metrics...</p>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="text-red-500 w-16 h-16" />
        <h2 className="text-2xl font-bold">Connection Error</h2>
        <p className="text-slate-400 max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-xl transition font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Growth Dashboard</h1>
          <p className="text-slate-400 mt-1">Real-time performance metrics</p>
        </div>

        <button
          onClick={handleDownloadReport}
          className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-5 py-2.5 rounded-xl transition"
        >
          <FileDown size={18} />
          <span>Download PDF Report</span>
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Average Score" value={metrics.averageScore} percentage="+5%" />
        <StatCard title="Number of Leads" value={metrics.totalLeads} percentage="+12%" />
        <StatCard
          title="Effectivity"
          value={`${metrics.effectivity}%`}
          percentage="-2%"
          positive={false}
        />
        <StatCard
          title="Average Ticket"
          value={`$${metrics.averageTicket}`}
          percentage="+8%"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InteractionChart data={interactionData} />
        <CustomFunnel data={funnelData} />
      </div>

      {/* Full Width Chart */}
      <ClassificationChart data={classificationData} />
    </div>
  );
}
