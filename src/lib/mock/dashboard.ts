// lib/mock/dashboard.mock.ts
// TODO: Ganti fungsi ini dengan fetch dari Supabase ketika backend siap.

import type { DashboardData } from "@/types/dashboard";

export const MOCK_DASHBOARD_DATA: DashboardData = {
  wallet: {
    totalPoints: 400,
    redemptionThreshold: 500,
    redemptionLabel: "Voucher Kantin",
  },

  cta: {
    pointsNeeded: 150,
    progressPercent: 70,
    rewardLabel: "Voucher Makan Gratis",
  },

  chart: {
    title: "Points Earned",
    dateRange: "01 - 15 April 2026",
    activeBarIndex: 12,
    data: [
      { value: 10 },
      { value: 20 },
      { value: 15 },
      { value: 30 },
      { value: 10 },
      { value: 40 },
      { value: 25 },
      { value: 10 },
      { value: 15 },
      { value: 20 },
      { value: 35 },
      { value: 15 },
      { value: 50 },
      { value: 40 },
    ],
  },

  nearestMachine: {
    name: "TrasMart Kantin TI",
    status: "online",
    capacityPercent: 45,
  },

  todayHistory: [
    {
      id: "history-1",
      label: "Botol Plastik",
      machineName: "TrasMart Kantin TI",
      time: "16:30",
      points: 15,
      iconVariant: "recycle",
    },
    {
      id: "history-2",
      label: "Botol Kaleng (Metal)",
      machineName: "TrasMart Kantin TI",
      time: "16:28",
      points: 20,
      iconVariant: "coin",
    },
  ],
};

/**
 * Simulasi async fetch — swap isi fungsi ini dengan query Supabase nanti.
 * Contoh pengganti:
 *
 * import { createClient } from "@/lib/supabase/server";
 * export async function getDashboardData(userId: string): Promise<DashboardData> {
 *   const supabase = createClient();
 *   const { data, error } = await supabase
 *     .from("dashboard_summary")
 *     .select("*")
 *     .eq("user_id", userId)
 *     .single();
 *   if (error) throw error;
 *   return data;
 * }
 */
export async function getDashboardData(): Promise<DashboardData> {
  // Simulasi network latency (opsional, hapus di production)
  // await new Promise((res) => setTimeout(res, 300));
  return MOCK_DASHBOARD_DATA;
}