import type {
  DashboardMetrics,
  InteractionSource,
  FunnelData,
  ClassificationData,
} from "../services/api";

export const mockMetrics: DashboardMetrics = {
  averageScore: 8.5,
  totalLeads: 1247,
  effectivity: 73,
  averageTicket: 4250,
};

export const mockInteractions: InteractionSource[] = [
  { source: "Website", value: 1400 },
  { source: "Phone", value: 1100 },
  { source: "Email", value: 900 },
  { source: "Social Media", value: 700 },
  { source: "Referral", value: 500 },
];

export const mockFunnel: FunnelData[] = [
  { name: "Leads", value: 1247 },
  { name: "Qualified", value: 900 },
  { name: "Proposal", value: 600 },
  { name: "Negotiation", value: 300 },
  { name: "Closed", value: 200 },
];

export const mockClassification: ClassificationData[] = [
  { month: "Jan", cold: 30, warm: 45, hot: 25 },
  { month: "Feb", cold: 28, warm: 42, hot: 30 },
  { month: "Mar", cold: 25, warm: 40, hot: 35 },
  { month: "Apr", cold: 22, warm: 43, hot: 35 },
  { month: "May", cold: 20, warm: 45, hot: 35 },
  { month: "Jun", cold: 18, warm: 47, hot: 35 },
];