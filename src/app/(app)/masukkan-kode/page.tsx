"use client";

import { FormEvent, useEffect, useState, useCallback } from "react";
import styles from "./masukkan-kode.module.scss";
import PageTopbar from "@/components/layout/PageTopbar";

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function MasukkanKodeRoute() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    machine_name?: string;
  } | null>(null);

  const [pairedSession, setPairedSession] = useState<{
    session_code: string;
    expires_at: string;
    time_remaining: number;
  } | null>(null);

  const [refreshingTimer, setRefreshingTimer] = useState(false);

  const fetchSessionStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/machines/session");
      const data = await res.json();

      if (data.paired && data.expires_at) {
        const now = new Date().getTime();
        const expires = new Date(data.expires_at).getTime();
        const remaining = Math.max(0, Math.floor((expires - now) / 1000));

        setPairedSession({
          session_code: data.session_code,
          expires_at: data.expires_at,
          time_remaining: remaining,
        });
      } else {
        setPairedSession(null);
      }
    } catch {
      setPairedSession(null);
    }
  }, []);

  useEffect(() => {
    fetchSessionStatus();
    const interval = setInterval(fetchSessionStatus, 1000);
    return () => clearInterval(interval);
  }, [fetchSessionStatus]);

  const handleRefreshTimer = async () => {
    setRefreshingTimer(true);
    try {
      const res = await fetch("/api/machines/refresh", { method: "POST" });
      const data = await res.json();

      if (data.success) {
        fetchSessionStatus();
      }
    } catch {
      console.error("Failed to refresh timer");
    } finally {
      setRefreshingTimer(false);
    }
  };

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
        setCode("");
        setTimeout(() => fetchSessionStatus(), 500);
      }
    } catch {
      setResult({ success: false, message: "Gagal terhubung ke server." });
    } finally {
      setLoading(false);
    }
  };

  const expiryPercentage = pairedSession
    ? Math.min(100, (pairedSession.time_remaining / 90) * 100)
    : 0;

  const expiryColor =
    expiryPercentage > 50
      ? "var(--dark-green, #1B7A4E)"
      : expiryPercentage > 25
        ? "#F59E0B"
        : "#EF4444";

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

      {pairedSession && (
        <section className={styles.activeSession}>
          <div className={styles.sessionHeader}>
            <h3>Sesi Aktif</h3>
            <span className={styles.sessionCode}>{pairedSession.session_code}</span>
          </div>

          <div className={styles.timerContainer}>
            <div className={styles.timerLabel}>
              <span>Waktu tersisa</span>
              <span className={styles.timerValue} style={{ color: expiryColor }}>
                {formatTime(pairedSession.time_remaining)}
              </span>
            </div>

            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${expiryPercentage}%`,
                  backgroundColor: expiryColor,
                }}
              />
            </div>

            <button
              type="button"
              className={styles.refreshBtn}
              onClick={handleRefreshTimer}
              disabled={refreshingTimer}
            >
              {refreshingTimer ? "Refreshing..." : "Perpanjang Waktu (+1:30)"}
            </button>
          </div>
        </section>
      )}

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
            disabled={loading || !!pairedSession}
          />

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading || !!pairedSession}
          >
            {loading ? "Menghubungkan..." : pairedSession ? "Sudah Terhubung" : "Hubungkan"}
          </button>
        </form>

        {result && (
          <div className={result.success ? styles.successText : styles.errorText}>
            <p>{result.message}</p>
            {result.success && result.machine_name && (
              <p>Mesin: <strong>{result.machine_name}</strong></p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
