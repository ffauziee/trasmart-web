import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import {
  Leaf,
  MapPin,
  HandCoins,
  Recycle,
  Target,
  TrendingUp,
  Zap,
  ChevronRight,
  BarChart3,
  Activity,
  PlusCircle,
  Droplets,
  Box,
  FileText,
} from "lucide-react";
import styles from "./dashboard.module.scss";

import { getDashboardData, formatDisplayDate } from "@/lib/data/dashboard";
import type { HistoryEntry, HistoryIconVariant } from "@/types/dashboard";
import { createClient } from "@/lib/utils/supabase/server";

function getHistoryIconClass(variant: HistoryIconVariant): string {
  switch (variant) {
    case "plastic":
      return styles.historyIconPlastic;
    case "metal":
      return styles.historyIconMetal;
    case "paper":
      return styles.historyIconPaper;
    default:
      return styles.historyIconOther;
  }
}

function getHistoryIcon(variant: HistoryIconVariant) {
  switch (variant) {
    case "plastic":
      return <Droplets size={16} />;
    case "metal":
      return <Box size={16} />;
    case "paper":
      return <FileText size={16} />;
    default:
      return <Recycle size={16} />;
  }
}

function getTodayString(): string {
  const now = new Date();
  const wibTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
  const yyyy = wibTime.getFullYear();
  const mm = String(wibTime.getMonth() + 1).padStart(2, "0");
  const dd = String(wibTime.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export const revalidate = 0;

export default async function DashboardRoute({
  searchParams,
}: {
  searchParams?: Promise<{ date?: string }>;
}) {
  await connection();

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  let data;
  try {
    data = await getDashboardData(user.id, supabase);
  } catch (err) {
    return (
      <div className={styles.mainContainer}>
        <p>
          Gagal memuat data:{" "}
          {err instanceof Error ? err.message : "Terjadi kesalahan"}
        </p>
      </div>
    );
  }

  const { wallet, cta, chart, nearestMachine, allTransactionsByDate } = data;
  const params = await searchParams;
  const fallbackDate = chart.data.at(-1)?.date ?? getTodayString();
  const requestedDate = params?.date;
  const selectedDate =
    requestedDate && allTransactionsByDate[requestedDate]
      ? requestedDate
      : fallbackDate;

  const pointsToGo = wallet.redemptionThreshold - wallet.totalPoints;
  const isToday = selectedDate === getTodayString();
  const visibleHistory: HistoryEntry[] =
    allTransactionsByDate[selectedDate] ?? [];

  const historyLabel = isToday ? "Hari Ini" : formatDisplayDate(selectedDate);
  const progressPercent = Math.min(
    (wallet.totalPoints / Math.max(wallet.redemptionThreshold, 1)) * 100,
    100
  );

  const chartDisplayData = chart.data.length > 0 ? chart.data : generateEmptyChart();

  const totalPoints = chartDisplayData.reduce((sum, d) => sum + d.rawValue, 0);
  const maxDay = chartDisplayData.reduce((max, d) => (d.rawValue > max.rawValue ? d : max), chartDisplayData[0]);
  const avgDay = chartDisplayData.length > 0 ? Math.round(totalPoints / chartDisplayData.length) : 0;

  return (
    <div className={styles.mainContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.greeting}>
            <span className={styles.greetingEmoji}>🌿</span>
            <span>Selamat Datang</span>
          </div>
          <h1 className={styles.headerTitle}>Dashboard</h1>
          <p className={styles.headerDesc}>
            Pantau poin dan riwayat setoran sampahmu di sini.
          </p>
        </div>
      </header>

      {/* Stat Cards */}
      <div className={styles.statCards}>
        <div className={styles.statCard}>
          <div className={styles.statCardIcon}>
            <Zap size={20} />
          </div>
          <div className={styles.statCardBody}>
            <span className={styles.statCardLabel}>Total Poin</span>
            <span className={styles.statCardValue}>{wallet.totalPoints.toLocaleString("id-ID")}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardIcon}>
            <Target size={20} />
          </div>
          <div className={styles.statCardBody}>
            <span className={styles.statCardLabel}>Target Berikutnya</span>
            <span className={styles.statCardValue}>{wallet.redemptionLabel !== "-" ? wallet.redemptionLabel : "Belum ada"}</span>
            <span className={styles.statCardSub}>
              {wallet.redemptionThreshold > 0 ? `Min. ${wallet.redemptionThreshold.toLocaleString("id-ID")} Pts` : "Setor sampah untuk mulai"}
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardIcon}>
            <TrendingUp size={20} />
          </div>
          <div className={styles.statCardBody}>
            <span className={styles.statCardLabel}>Kurang</span>
            <span className={styles.statCardValue}>{Math.max(0, pointsToGo).toLocaleString("id-ID")}</span>
            <span className={styles.statCardSub}>poin lagi</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardIcon}>
            <Recycle size={20} />
          </div>
          <div className={styles.statCardBody}>
            <span className={styles.statCardLabel}>Progress</span>
            <span className={styles.statCardValue}>{Math.round(progressPercent)}%</span>
            <div className={styles.statCardProgress}>
              <div
                className={styles.statCardProgressFill}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Primary Action Bar */}
      <Link href="/masukkan-kode" className={styles.primaryAction}>
        <div className={styles.primaryActionIcon}>
          <PlusCircle size={24} />
        </div>
        <div className={styles.primaryActionContent}>
          <span className={styles.primaryActionLabel}>Mulai Setor Sampah</span>
          <span className={styles.primaryActionDesc}>Masukkan kode untuk pair mesin IoT dan mulai mendaur ulang</span>
        </div>
        <ChevronRight size={20} className={styles.primaryActionArrow} />
      </Link>

      {/* Main Grid */}
      <div className={styles.gridContainer}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          {/* Chart Card — redesigned */}
          <div className={styles.chartCard}>
            <div className={styles.chartCardBg} />
            <div className={styles.chartCardGrid} />

            <div className={styles.chartCardHeader}>
              <div className={styles.chartCardHeaderLeft}>
                <div className={styles.chartCardIcon}>
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h3 className={styles.chartCardTitle}>Aktivitas Poin</h3>
                  <p className={styles.chartCardSubtitle}>
                    {chart.dateRange !== "-" ? chart.dateRange : "Belum ada aktivitas bulan ini"}
                  </p>
                </div>
              </div>
              <div className={styles.chartCardStats}>
                <div className={styles.chartStat}>
                  <Activity size={14} />
                  <span>Total <strong>{totalPoints.toLocaleString("id-ID")}</strong></span>
                </div>
                <div className={styles.chartStat}>
                  <TrendingUp size={14} />
                  <span>Rata-rata <strong>{avgDay}</strong>/hari</span>
                </div>
                {maxDay && maxDay.rawValue > 0 && (
                  <div className={styles.chartStat}>
                    <Zap size={14} />
                    <span>Tertinggi <strong>{maxDay.rawValue}</strong></span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.chartArea}>
              {chartDisplayData.length > 0 ? (
                <>
                  {/* Grid lines */}
                  <div className={styles.chartGridLines}>
                    {[100, 75, 50, 25, 0].map((pct) => (
                      <div key={pct} className={styles.chartGridLine} style={{ bottom: `${pct}%` }}>
                        <span>{pct}%</span>
                      </div>
                    ))}
                  </div>

                  <div className={styles.chartBars}>
                    {chartDisplayData.map((point) => {
                      const isActive = point.date === selectedDate;
                      const dayLabel = new Date(point.date + "T00:00:00Z").toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        timeZone: "Asia/Jakarta",
                      });
                      return (
                        <Link
                          key={point.date}
                          href={`/dashboard?date=${point.date}`}
                          className={`${styles.barItem} ${isActive ? styles.barItemActive : ""}`}
                          title={`${formatDisplayDate(point.date)}: ${point.rawValue} Pts`}
                        >
                          <div className={styles.barWrapper}>
                            <div
                              className={`${styles.bar} ${isActive ? styles.barActive : ""}`}
                              style={{
                                height: `${Math.max(point.heightPercent, 3)}%`,
                                animationDelay: `${chartDisplayData.indexOf(point) * 50}ms`,
                              }}
                            />
                            {isActive && point.rawValue > 0 && (
                              <div className={styles.barTooltip}>{point.rawValue} Pts</div>
                            )}
                          </div>
                          <span className={`${styles.barLabel} ${isActive ? styles.barLabelActive : ""}`}>
                            {dayLabel}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className={styles.chartEmpty}>
                  <Recycle size={48} strokeWidth={1.5} />
                  <p>Belum ada aktivitas daur ulang</p>
                  <span>Mulai setor sampah untuk melihat grafik di sini</span>
                </div>
              )}
            </div>
          </div>

          {/* History */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderIcon}>
                <HandCoins size={18} />
              </div>
              <div>
                <h3 className={styles.cardTitle}>{historyLabel}</h3>
                <p className={styles.cardSubtitle}>Riwayat setoran</p>
              </div>
            </div>
            <div className={styles.historyList}>
              {visibleHistory.length === 0 ? (
                <p className={styles.emptyText}>
                  Tidak ada setoran pada {formatDisplayDate(selectedDate)}.
                </p>
              ) : (
                visibleHistory.map((entry) => (
                  <div key={entry.id} className={styles.historyItem}>
                    <div className={getHistoryIconClass(entry.iconVariant)}>
                      {getHistoryIcon(entry.iconVariant)}
                    </div>
                    <div className={styles.historyInfo}>
                      <p className={styles.historyLabel}>{entry.label}</p>
                      <p className={styles.historyMeta}>
                        {entry.machineName ?? "Mesin tidak diketahui"} • {entry.time}
                      </p>
                    </div>
                    <span className={styles.historyPoints}>+{entry.points}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column — Sidebar */}
        <div className={styles.rightColumn}>
          {/* CTA Card */}
          <div className={styles.ctaCard}>
            <div className={styles.ctaBg} />
            <div className={styles.ctaBg2} />
            <div className={styles.ctaContent}>
              <div className={styles.ctaIconWrap}>
                <Leaf size={28} />
              </div>
              <h3 className={styles.ctaTitle}>Tukarkan Poinmu!</h3>
              <p className={styles.ctaDesc}>
                Tinggal <strong>{Math.max(0, pointsToGo).toLocaleString("id-ID")}</strong> poin lagi untuk{" "}
                {cta.rewardLabel !== "-" ? cta.rewardLabel : "reward pertama"}.
              </p>
              <div className={styles.ctaProgressWrap}>
                <div className={styles.ctaProgressBar}>
                  <div
                    className={styles.ctaProgressFill}
                    style={{ width: `${cta.progressPercent}%` }}
                  />
                </div>
                <span className={styles.ctaProgressLabel}>{cta.progressPercent}%</span>
              </div>
              <Link href="/reward" className={styles.ctaButton}>
                Lihat Katalog
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>

          {/* Machine Status — moved to sidebar */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderIcon}>
                <MapPin size={18} />
              </div>
              <h3 className={styles.cardTitle}>Status Mesin</h3>
            </div>
            {nearestMachine ? (
              <div className={styles.machineInfo}>
                <div className={styles.machineHeader}>
                  <div>
                    <p className={styles.machineName}>{nearestMachine.name}</p>
                    <p className={styles.machineLocation}>{nearestMachine.locationLabel}</p>
                  </div>
                  {nearestMachine.status === "online" && (
                    <span className={styles.onlineBadge}>
                      <span className={styles.pulseIndicator}>
                        <span className={styles.pulsePing} />
                        <span className={styles.pulseDot} />
                      </span>
                      Online
                    </span>
                  )}
                </div>
                <div className={styles.machineCapacity}>
                  <div className={styles.capacityHeader}>
                    <span>Kapasitas</span>
                    <span>{nearestMachine.capacityPercent}%</span>
                  </div>
                  <div className={styles.capacityBar}>
                    <div
                      className={styles.capacityFill}
                      style={{ width: `${nearestMachine.capacityPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p className={styles.emptyText}>Tidak ada mesin yang tersedia saat ini.</p>
            )}
          </div>

          {/* Impact */}
          <div className={styles.impactCard}>
            <div className={styles.impactIcon}>
              <Leaf size={20} />
            </div>
            <div className={styles.impactContent}>
              <span className={styles.impactLabel}>Dampak Lingkungan</span>
              <span className={styles.impactValue}>{wallet.totalPoints.toLocaleString("id-ID")} poin dikonversi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function generateEmptyChart() {
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    days.push({ date: `${yyyy}-${mm}-${dd}`, rawValue: 0, heightPercent: 3 });
  }
  return days;
}
