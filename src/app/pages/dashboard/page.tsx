import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Leaf, MapPin, HandCoins } from "lucide-react";
import styles from "./dashboard.module.scss";
import PageTopbar from "@/components/layout/PageTopbar";

import { getDashboardData, formatDisplayDate } from "@/lib/mock/dashboard";
import type {
  HistoryEntry,
  HistoryIconVariant,
} from "@/types/dashboard";
import { createClient } from "@/lib/utils/supabase/server";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getHistoryIconClass(variant: HistoryIconVariant): string {
  return variant === "recycle"
    ? styles.historyIconRecycle
    : styles.historyIconCoin;
}

function getTodayString(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export const revalidate = 0;

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

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
          Gagal memuat data: {err instanceof Error ? err.message : "Terjadi kesalahan"}
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

  return (
    <div className={styles.mainContainer}>
      <PageTopbar
        title="Points Wallet"
        description="Pantau poin dan riwayat setoran sampahmu di sini."
        topbarClassName={styles.topbar}
        topbarContentClassName={styles.topbarContent}
        notificationBtnClassName={styles.notificationBtn}
        notificationBadgeClassName={styles.notificationBadge}
      />

      <div className={styles.gridContainer}>
        <div className={styles.leftColumn}>
          {/* Banner + CTA */}
          <div className={styles.bannerCard}>
            <div className={styles.bannerGradient}></div>
            <div className={styles.bannerContent}>
              <p className={styles.bannerLabel}>Total Balance</p>
              <div className={styles.balanceDisplay}>
                <span className={styles.balanceAmount}>
                  {wallet.totalPoints}
                </span>
                <span className={styles.balanceUnit}>Pts</span>
              </div>
              <p className={styles.balanceDescription}>
                Bisa ditukar dengan {wallet.redemptionLabel} (min.{" "}
                {wallet.redemptionThreshold} Pts)
              </p>
            </div>

            <div className={styles.ctaCard}>
              <div className={styles.ctaIcon}>
                <Leaf size={128} />
              </div>
              <h3 className={styles.ctaTitle}>Tukarkan Poinmu!</h3>
              <p className={styles.ctaDescription}>
                Tinggal {pointsToGo} Poin lagi untuk mendapatkan{" "}
                {cta.rewardLabel}.
              </p>
              <div className={styles.ctaProgressBar}>
                <div
                  className={styles.ctaProgressFill}
                  style={{ width: `${cta.progressPercent}%` }}
                ></div>
              </div>
              <Link href="/reward" className={styles.ctaButton}>
                Lihat Katalog Hadiah
              </Link>
            </div>
          </div>

          {/* ----------------------------------------------------------------
              Chart
          ---------------------------------------------------------------- */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div className={styles.chartTitle}>
                <h3>{chart.title}</h3>
                <p className={styles.chartSubtitle}>{chart.dateRange}</p>
              </div>
            </div>
            <div className={styles.chartBars}>
              {chart.data.map((point) => (
                <Link
                  key={point.date}
                  href={`/dashboard?date=${point.date}`}
                  className={styles.barContainer}
                  title={`${formatDisplayDate(point.date)}: ${point.rawValue} Pts`}
                >
                  {/* Label tanggal */}
                  <div
                    className={`${styles.bar} ${
                      point.date === selectedDate ? styles.active : ""
                    }`}
                    style={{ height: `${point.heightPercent}%` }}
                  ></div>
                  <span
                    style={{
                      fontSize: "10px",
                      color:
                        point.date === selectedDate ? "#166534" : "#9ca3af",
                      fontWeight: point.date === selectedDate ? 700 : 400,
                      marginTop: "4px",
                      display: "block",
                      textAlign: "center",
                      lineHeight: 1.2,
                    }}
                  >
                    {new Date(point.date + "T00:00:00").toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "numeric",
                      },
                    )}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.statusCard}>
            <div className={styles.statusCardBorder}></div>
            <h3 className={styles.statusTitle}>
              <MapPin size={16} className="text-[#166534]" /> Status Mesin
              Terdekat
            </h3>
            {nearestMachine ? (
              <div>
                <div className={styles.statusMachine}>
                  <div>
                    <p className={styles.machineName}>{nearestMachine.name}</p>
                    <p className={styles.capacityText}>
                      {nearestMachine.locationLabel}
                    </p>
                  </div>
                  {nearestMachine.status === "online" && (
                    <span className={styles.onlineBadge}>
                      <span className={styles.pulseIndicator}>
                        <span className={styles.pulsePing}></span>
                        <span className={styles.pulseDot}></span>
                      </span>
                      Online
                    </span>
                  )}
                </div>
                <div className={styles.capacityBar}>
                  <div
                    className={styles.capacityFill}
                    style={{ width: `${nearestMachine.capacityPercent}%` }}
                  ></div>
                </div>
                <p className={styles.capacityText}>
                  Kapasitas: {nearestMachine.capacityPercent}%
                </p>
              </div>
            ) : (
              <p className={styles.capacityText}>
                Tidak ada mesin yang tersedia saat ini.
              </p>
            )}
          </div>

          {/* ----------------------------------------------------------------
              history
          ---------------------------------------------------------------- */}
          <div className={styles.historySection}>
            <div className={styles.historyHeader}>
              <h3 className={styles.historyTitle}>{historyLabel}</h3>
            </div>
            <div className={styles.historyContainer}>
              {visibleHistory.length === 0 ? (
                <p className={styles.capacityText}>
                  Tidak ada setoran pada {formatDisplayDate(selectedDate)}.
                </p>
              ) : (
                visibleHistory.map((entry) => (
                  <div key={entry.id} className={styles.historyItem}>
                    <div className={getHistoryIconClass(entry.iconVariant)}>
                      <HandCoins size={20} />
                    </div>
                    <div className={styles.historyInfo}>
                      <p className={styles.historyTitle}>{entry.label}</p>
                      <p className={styles.historyMeta}>
                        <MapPin size={12} />
                        {entry.machineName ?? "Mesin tidak diketahui"} •{" "}
                        {entry.time}
                      </p>
                    </div>
                    <p className={styles.historyPoints}>+{entry.points} Pts</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
