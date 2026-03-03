import { useEffect, useState } from "react";
import { downloadReport, downloadApk } from "../services/api";
import StatCard from "../components/StatCard";
import InteractionChart from "../components/InteractionChart";
import CustomFunnel from "../components/FunnelChart";
import ClassificationChart from "../components/ClassificationChart";
import {
  mockMetrics,
  mockInteractions,
  mockFunnel,
  mockClassification,
} from "../mocks/dashboardMock";

export default function Dashboard() {
  const [metrics, setMetrics] = useState(mockMetrics);
  const [interactionData] = useState(mockInteractions);
  const [funnelData] = useState(mockFunnel);
  const [classificationData] = useState(mockClassification);

  const handleDownloadReport = async () => {
  try {
    const response = await downloadReport();
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "report.pdf");
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error("Report download failed", error);
  }
};

const handleDownloadApk = async () => {
  try {
    const response = await downloadApk();
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "app-release.apk");
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error("APK download failed", error);
  }
};

  return (
  <div className="min-h-screen bg-slate-900 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Analytics Dashboard
        </h1>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDownloadReport}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition w-full sm:w-auto"
          >
            Download Report
          </button>

          <button
            onClick={handleDownloadApk}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl transition w-full sm:w-auto"
          >
            Download APK
          </button>
        </div>
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
      <div>
        <ClassificationChart data={classificationData} />
      </div>

    </div>
  </div>
  );
}
