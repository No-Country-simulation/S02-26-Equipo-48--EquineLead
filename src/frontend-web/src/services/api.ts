import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const downloadReport = async () => {
  return api.get("/reports/download", {
    responseType: "blob",
  });
};

export const downloadApk = async () => {
  return api.get("/builds/latest-apk", {
    responseType: "blob",
  });
};

export interface DashboardMetrics {
  averageScore: number;
  totalLeads: number;
  effectivity: number;
  averageTicket: number;
}

export interface InteractionSource {
  source: string;
  value: number;
}

export interface FunnelData {
  name: string;
  value: number;
}

export interface ClassificationData {
  month: string;
  cold: number;
  warm: number;
  hot: number;
}

export const getDashboardMetrics = () =>
  api.get<DashboardMetrics>("/metrics/dashboard");

export const getInteractionSources = () =>
  api.get<InteractionSource[]>("/metrics/interactions");

export const getFunnelData = () =>
  api.get<FunnelData[]>("/metrics/funnel");

export const getClassificationEvolution = () =>
  api.get<ClassificationData[]>("/metrics/classification");

export default api;