import styles from "./dashboard.module.scss";

type DailyWaste = {
  day: string;
  metal: number;
  nonMetal: number;
};

type WasteHistory = {
  id: number;
  item: string;
  category: "Logam" | "Non Logam";
  location: string;
  time: string;
  weightKg: number;
};

const dailyWasteData: DailyWaste[] = [
  { day: "Sen", metal: 9, nonMetal: 16 },
  { day: "Sel", metal: 11, nonMetal: 18 },
  { day: "Rab", metal: 12, nonMetal: 19 },
  { day: "Kam", metal: 14, nonMetal: 20 },
  { day: "Jum", metal: 13, nonMetal: 17 },
  { day: "Sab", metal: 16, nonMetal: 21 },
  { day: "Min", metal: 10, nonMetal: 15 },
];

const wasteHistory: WasteHistory[] = [
  {
    id: 1,
    item: "Kaleng Minuman",
    category: "Logam",
    location: "Mesin A - Kampus",
    time: "08:10",
    weightKg: 0.8,
  },
  {
    id: 2,
    item: "Botol Plastik 1L",
    category: "Non Logam",
    location: "Mesin B - Perpustakaan",
    time: "09:35",
    weightKg: 1.2,
  },
  {
    id: 3,
    item: "Kaleng Makanan",
    category: "Logam",
    location: "Mesin C - Kantin",
    time: "11:02",
    weightKg: 0.6,
  },
  {
    id: 4,
    item: "Botol Plastik 600ml",
    category: "Non Logam",
    location: "Mesin A - Kampus",
    time: "13:27",
    weightKg: 0.9,
  },
  {
    id: 5,
    item: "Kaleng Aerosol Kosong",
    category: "Logam",
    location: "Mesin D - Asrama",
    time: "15:41",
    weightKg: 0.5,
  },
];

const totalMetal = dailyWasteData.reduce((sum, item) => sum + item.metal, 0);
const totalNonMetal = dailyWasteData.reduce(
  (sum, item) => sum + item.nonMetal,
  0,
);
const totalWaste = totalMetal + totalNonMetal;

export default function DashboardPage() {
  return (
    <section className={styles.dashboardWrapper}>
      <div className={styles.panelGrid}>
        <article className={styles.mainPanel}>
          <header className={styles.headerBlock}>
            <div>
              <p className={styles.kicker}>Dashboard Sampah Masuk</p>
              <h1>Monitoring Tong Sampah Pintar</h1>
              <p className={styles.dateText}>
                Periode Mingguan - 14 April 2026
              </p>
            </div>
          </header>

          <div className={styles.chartCard}>
            <div className={styles.chartTitleRow}>
              <h2>Chart Barang Masuk</h2>
              <div className={styles.legend}>
                <span>
                  <i className={styles.dotMetal} /> Logam
                </span>
                <span>
                  <i className={styles.dotNonMetal} /> Non Logam
                </span>
              </div>
            </div>

            <div className={styles.chartArea}>
              {dailyWasteData.map((data) => (
                <div key={data.day} className={styles.dayGroup}>
                  <div className={styles.bars}>
                    <div
                      className={`${styles.bar} ${styles.metalBar}`}
                      style={{ height: `${data.metal * 6}px` }}
                      aria-label={`Logam ${data.day}: ${data.metal}`}
                    />
                    <div
                      className={`${styles.bar} ${styles.nonMetalBar}`}
                      style={{ height: `${data.nonMetal * 6}px` }}
                      aria-label={`Non logam ${data.day}: ${data.nonMetal}`}
                    />
                  </div>
                  <span>{data.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.historyCard}>
            <h2>History Barang Masuk</h2>
            <ul className={styles.historyList}>
              {wasteHistory.map((log) => (
                <li key={log.id} className={styles.historyItem}>
                  <span
                    className={`${styles.historyDot} ${
                      log.category === "Logam"
                        ? styles.metalHistory
                        : styles.nonMetalHistory
                    }`}
                  />
                  <div className={styles.historyInfo}>
                    <strong>{log.item}</strong>
                    <p>
                      {log.location} - {log.time}
                    </p>
                  </div>
                  <div className={styles.historyMeta}>
                    <span>{log.category}</span>
                    <strong>{log.weightKg} kg</strong>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <aside className={styles.sidePanel}>
          <div className={styles.summaryCard}>
            <h3>Jumlah Barang Masuk</h3>
            <p className={styles.totalText}>{totalWaste} item minggu ini</p>

            <div className={styles.progressRow}>
              <div className={styles.progressHead}>
                <span>Logam</span>
                <strong>{totalMetal}</strong>
              </div>
              <div className={styles.progressTrack}>
                <div
                  className={`${styles.progressFill} ${styles.progressMetal}`}
                  style={{ width: `${(totalMetal / totalWaste) * 100}%` }}
                />
              </div>
            </div>

            <div className={styles.progressRow}>
              <div className={styles.progressHead}>
                <span>Non Logam</span>
                <strong>{totalNonMetal}</strong>
              </div>
              <div className={styles.progressTrack}>
                <div
                  className={`${styles.progressFill} ${styles.progressNonMetal}`}
                  style={{ width: `${(totalNonMetal / totalWaste) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className={styles.infoCard}>
            <p className={styles.infoLabel}>Insight</p>
            <h4>Non Logam masih dominan</h4>
            <p>
              Tambahkan kampanye pemilahan kaleng agar komposisi logam naik
              pekan depan.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
