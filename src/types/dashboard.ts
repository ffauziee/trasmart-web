// types/dashboard.types.ts

export interface WalletInfo {
  totalPoints: number;
  redemptionThreshold: number;
  redemptionLabel: string;
}

export interface CtaInfo {
  pointsNeeded: number;
  progressPercent: number;
  rewardLabel: string;
}

export interface ChartDataPoint {
  value: number; // 0–100, represents bar height percentage
}

export interface ChartInfo {
  title: string;
  dateRange: string;
  activeBarIndex: number;
  data: ChartDataPoint[];
}

export type MachineStatus = "online" | "offline" | "maintenance";

export interface NearestMachine {
  name: string;
  status: MachineStatus;
  capacityPercent: number;
}

export type HistoryIconVariant = "recycle" | "coin";

export interface HistoryEntry {
  id: string;
  label: string;
  machineName: string;
  time: string; // e.g. "16:30"
  points: number;
  iconVariant: HistoryIconVariant;
}

export interface DashboardData {
  wallet: WalletInfo;
  cta: CtaInfo;
  chart: ChartInfo;
  nearestMachine: NearestMachine;
  todayHistory: HistoryEntry[];
}