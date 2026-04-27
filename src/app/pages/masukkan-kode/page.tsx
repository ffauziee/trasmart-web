"use client";

import { FormEvent, useState } from "react";
import styles from "./masukkan-kode.module.scss";
import PageTopbar from "@/components/layout/PageTopbar";

export default function MasukkanKodeRoute() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    machine_name?: string;
  } | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedCode = code.trim();

    if (!trimmedCode) {
      setResult({ success: false, message: "Kode tidak boleh kosong." });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/machines/pair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: trimmedCode }),
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        setCode(""); // Reset input setelah berhasil
      }
    } catch (error) {
      setResult({ success: false, message: "Gagal terhubung ke server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.mainContainer}>
      <PageTopbar
        title="Masukkan Kode"
        description="Masukkan kode yang tampil di layar mesin TrashMart."
        topbarClassName={styles.topbar}
        topbarContentClassName={styles.topbarContent}
        notificationBtnClassName={styles.notificationBtn}
        notificationBadgeClassName={styles.notificationBadge}
      />

      <section className={styles.formCard}>
        <h3>Hubungkan ke Mesin</h3>
        <p className={styles.formHint}>
          Lihat kode di layar mesin, lalu masukkan di bawah ini.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="kode-input" className={styles.label}>
            Kode Mesin
          </label>
          <input
            id="kode-input"
            type="text"
            className={styles.input}
            placeholder="Contoh: TM-4829"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            autoComplete="off"
            maxLength={10}
            disabled={loading}
          />

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Menghubungkan..." : "Hubungkan"}
          </button>
        </form>

        {result && (
          <div className={result.success ? styles.successText : styles.errorText}>
            <p>{result.message}</p>
            {result.success && result.machine_name && (
              <p>📍 Mesin: <strong>{result.machine_name}</strong></p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
