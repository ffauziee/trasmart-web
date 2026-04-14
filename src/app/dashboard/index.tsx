import styles from "./dashboard.module.scss";

type DailyWaste = {
  day: string;
  metal: number;
  nonMetal: number;
};

type WasteHistory = {
  id: string;
  time: string;
  item: string;
  category: "Logam" | "Non-Logam";
  weight: string;
  points: number;
  status: "Berhasil" | "Diproses";
};

const dailyWasteData: DailyWaste[] = [
  { day: "Sen", metal: 22, nonMetal: 31 },
  { day: "Sel", metal: 19, nonMetal: 28 },
  { day: "Rab", metal: 25, nonMetal: 35 },
  { day: "Kam", metal: 24, nonMetal: 33 },
  { day: "Jum", metal: 30, nonMetal: 39 },
  { day: "Sab", metal: 27, nonMetal: 34 },
  { day: "Min", metal: 18, nonMetal: 26 },
];

const historyData: WasteHistory[] = [
  {
    id: "TRS-9021",
    time: "14 Apr 2026, 08:22",
    item: "Kaleng Minuman",
    category: "Logam",
    weight: "0.35 kg",
    points: 18,
    status: "Berhasil",
  },
  {
    id: "TRS-9020",
    time: "14 Apr 2026, 08:15",
    item: "Botol Plastik 1.5L",
    category: "Non-Logam",
    weight: "0.70 kg",
    points: 24,
    status: "Berhasil",
  },
  {
    id: "TRS-9019",
    time: "14 Apr 2026, 07:56",
    item: "Kaleng Susu",
    category: "Logam",
    weight: "0.42 kg",
    points: 20,
    status: "Diproses",
  },
  {
    id: "TRS-9018",
    time: "13 Apr 2026, 19:42",
    item: "Botol Plastik 600ml",
    category: "Non-Logam",
    weight: "0.48 kg",
    points: 17,
    status: "Berhasil",
  },
  {
    id: "TRS-9017",
    time: "13 Apr 2026, 18:10",
    item: "Kaleng Soda",
    category: "Logam",
    weight: "0.30 kg",
    points: 16,
    status: "Berhasil",
  },
];

const maxValue = Math.max(
  ...dailyWasteData.map((entry) => Math.max(entry.metal, entry.nonMetal)),
);

export default function DashboardPage() {
  const totalMetal = dailyWasteData.reduce(
    (sum, entry) => sum + entry.metal,
    0,
  );
  const totalNonMetal = dailyWasteData.reduce(
    (sum, entry) => sum + entry.nonMetal,
    0,
  );
  const totalItems = totalMetal + totalNonMetal;

  return (
    <main className={styles.dashboard}>
      <section className={styles.headerCard}>
        <div>
          <p className={styles.subtitle}>Dashboard Pemantauan Sampah</p>
          <h1>Monitoring Barang Masuk</h1>
          <p className={styles.description}>
            Pantau jumlah barang logam dan non-logam yang masuk ke tong sampah
            secara real-time.
          </p>
        </div>
        <div className={styles.summaryGrid}>
          <article>
            <h2>Total Mingguan</h2>
            <p>{totalItems} item</p>
          </article>
          <article>
            <h2>Logam</h2>
            <p>{totalMetal} item</p>
          </article>
          <article>
            <h2>Non-Logam</h2>
            <p>{totalNonMetal} item</p>
          </article>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.sectionTitleWrap}>
          <h2>Chart Barang Masuk ke Tong Sampah</h2>
          <p>Perbandingan jumlah logam dan non-logam dalam 7 hari terakhir.</p>
        </div>

        <div className={styles.chartLegend}>
          <div>
            <span className={`${styles.dot} ${styles.metal}`}></span>
            Logam
          </div>
          <div>
            <span className={`${styles.dot} ${styles.nonMetal}`}></span>
            Non-Logam
          </div>
        </div>

        <div className={styles.chartGrid}>
          {dailyWasteData.map((entry) => (
            <div key={entry.day} className={styles.chartDay}>
              <div className={styles.barGroup}>
                <div
                  className={`${styles.bar} ${styles.metal}`}
                  style={{
                    height: `${(entry.metal / maxValue) * 100}%`,
                  }}
                  title={`Logam: ${entry.metal} item`}
                ></div>
                <div
                  className={`${styles.bar} ${styles.nonMetal}`}
                  style={{
                    height: `${(entry.nonMetal / maxValue) * 100}%`,
                  }}
                  title={`Non-Logam: ${entry.nonMetal} item`}
                ></div>
              </div>
              <p>{entry.day}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.sectionTitleWrap}>
          <h2>History Barang Masuk</h2>
          <p>Riwayat transaksi terbaru barang yang telah terdeteksi mesin.</p>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Waktu</th>
                <th>Barang</th>
                <th>Kategori</th>
                <th>Berat</th>
                <th>Poin</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.time}</td>
                  <td>{row.item}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        row.category === "Logam"
                          ? styles.metalBadge
                          : styles.nonMetalBadge
                      }`}
                    >
                      {row.category}
                    </span>
                  </td>
                  <td>{row.weight}</td>
                  <td>{row.points}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        row.status === "Berhasil"
                          ? styles.success
                          : styles.processing
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
