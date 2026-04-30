"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/utils/supabase/client";
import styles from "./reset-password.module.scss";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  // Verifikasi session valid (dari link reset email)
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // Tidak ada session — link sudah expired atau tidak valid
        router.replace("/auth/login?error=Link+reset+tidak+valid+atau+sudah+kedaluwarsa");
        return;
      }
      setChecking(false);
    };

    void checkSession();
  }, [router, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password minimal 8 karakter");
      return;
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok");
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSuccess(true);
      // Sign out supaya user login fresh dengan password baru
      await supabase.auth.signOut();
      setTimeout(() => router.push("/auth/login"), 3000);
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className={styles.main}>
        <div className={styles.card}>
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <p>Memverifikasi link reset...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.main}>
      <div className={styles.card}>
        <div className={styles.header}>
          <img
            width="80"
            src="https://img.icons8.com/stickers/100/recycle-sign.png"
            alt="recycle-sign"
          />
          {success ? (
            <>
              <div className={styles.successIcon}>✓</div>
              <h1>Password Berhasil Diubah!</h1>
              <p>
                Kamu akan diarahkan ke halaman login dalam beberapa detik...
              </p>
            </>
          ) : (
            <>
              <h1>Buat Password Baru</h1>
              <p>Masukkan password baru untuk akun kamu.</p>
            </>
          )}
        </div>

        {!success && (
          <>
            {error && (
              <div className={styles.errorBox} role="alert">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Password Baru */}
              <div className={styles.formGroup}>
                <label htmlFor="new-password" className={styles.label}>
                  Password Baru
                </label>
                <div className={styles.passwordWrapper}>
                  <span className={styles.lockIcon}>
                    <Lock size={16} />
                  </span>
                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimal 8 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    autoFocus
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className={styles.toggleBtn}
                    onClick={() => setShowPassword((p) => !p)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <small className={styles.hint}>Minimal 8 karakter</small>
              </div>

              {/* Konfirmasi Password */}
              <div className={styles.formGroup}>
                <label htmlFor="confirm-password" className={styles.label}>
                  Konfirmasi Password Baru
                </label>
                <div className={styles.passwordWrapper}>
                  <span className={styles.lockIcon}>
                    <Lock size={16} />
                  </span>
                  <input
                    id="confirm-password"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Ulangi password baru"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className={styles.toggleBtn}
                    onClick={() => setShowConfirm((p) => !p)}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Simpan Password Baru"}
              </button>
            </form>

            <div className={styles.backLink}>
              <a href="/auth/login">← Kembali ke Login</a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
