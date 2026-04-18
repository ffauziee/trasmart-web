"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Leaf, MapPin, Bell, HandCoins } from "lucide-react";
import styles from "./dashboard.module.scss";

import { getDashboardData } from "@/lib/mock/dashboard";
import type { DashboardData, HistoryIconVariant } from "@/types/dashboard";

function getHistoryIconClass(variant: HistoryIconVariant): string {
  return variant === "recycle" ? styles.historyIconRecycle : styles.historyIconCoin;
}
// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------
export default function DashboardRoute() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    getDashboardData().then(setData);
  }, []);

// skeleton Loading
  if (!data) return null;

  const { wallet, cta, chart, nearestMachine, todayHistory } = data;

  const pointsToGo = wallet.redemptionThreshold - wallet.totalPoints;

  return (
    <div className={styles.mainContainer}>
      <div className={styles.topbar}>
        <div className={styles.topbarContent}>
          <h2>Points Wallet</h2>
          <p>Pantau poin dan riwayat setoran sampahmu di sini.</p>
        </div>
        <button className={styles.notificationBtn}>
          <Bell size={24} />
          <span className={styles.notificationBadge}></span>
        </button>
      </div>

      <div className={styles.gridContainer}>
        <div className={styles.leftColumn}>
          <div className={styles.bannerCard}>
            <div className={styles.bannerGradient}></div>
            <div className={styles.bannerContent}>
              <p className={styles.bannerLabel}>Total Balance</p>
              <div className={styles.balanceDisplay}>
                <span className={styles.balanceAmount}>{wallet.totalPoints}</span>
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
              <button
                type="button"
                className={styles.ctaButton}
                onClick={() => router.push("/reward")}
              >
                Lihat Katalog Hadiah
              </button>
            </div>
          </div>

          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div className={styles.chartTitle}>
                <h3>{chart.title}</h3>
                <p className={styles.chartSubtitle}>{chart.dateRange}</p>
              </div>
              <select className={styles.chartSelect}>
                <option>Bulan Ini</option>
                <option>Bulan Lalu</option>
              </select>
            </div>
            <div className={styles.chartBars}>
              {chart.data.map((point, i) => (
                <div key={i} className={styles.barContainer}>
                  <div
                    className={`${styles.bar} ${i === chart.activeBarIndex ? styles.active : ""}`}
                    style={{ height: `${point.value}%` }}
                  ></div>
                </div>
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
            <div>
              <div className={styles.statusMachine}>
                <p className={styles.machineName}>{nearestMachine.name}</p>
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
          </div>

          <div className={styles.historySection}>
            <div className={styles.historyHeader}>
              <h3 className={styles.historyTitle}>Hari Ini</h3>
            </div>
            <div className={styles.historyContainer}>
              {todayHistory.map((entry) => (
                <div key={entry.id} className={styles.historyItem}>
                  <div className={getHistoryIconClass(entry.iconVariant)}>
                    <HandCoins size={20} />
                  </div>
                  <div className={styles.historyInfo}>
                    <p className={styles.historyTitle}>{entry.label}</p>
                    <p className={styles.historyMeta}>
                      <MapPin size={12} />
                      {entry.machineName} • {entry.time}
                    </p>
                  </div>
                  <p className={styles.historyPoints}>+{entry.points} Pts</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}