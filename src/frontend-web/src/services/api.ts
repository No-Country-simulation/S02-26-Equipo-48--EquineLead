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
  pipelineValue: number;
  winRate: number;
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

export interface LeadTypeData {
  name: string;
  value: number;
}

export interface TopLead {
  userId: number;
  userName: string;
  score: number;
  classification: string;
  date: string;
}

export const getDashboardMetrics = () =>
  api.get<DashboardMetrics>("/metrics/dashboard");

export const getInteractionSources = () =>
  api.get<InteractionSource[]>("/metrics/interactions");

export const getFunnelData = () =>
  api.get<FunnelData[]>("/metrics/funnel");

export const getClassificationEvolution = () =>
  api.get<ClassificationData[]>("/metrics/classification");

export const getLeadTypes = () =>
  api.get<LeadTypeData[]>("/metrics/lead-types");

export const getTopLeads = (take: number = 10) =>
  api.get<TopLead[]>(`/score/top?take=${take}`);

export const syncLeads = () =>
  api.post("/scrapper/sync");

export default api;