/* eslint-disable @next/next/no-img-element */
"use client";

import styles from "./login.module.scss";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/utils/supabase/client";
import Link from "next/link";

type PageMode = "login" | "forgot";

export default function LoginPage() {
  const [mode, setMode] = useState<PageMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  // ── Login ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // ── OAuth ────────────────────────────────────────────────────────────────
  const handleGitHubLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });
      if (error) setError(error.message);
    } catch {
      setError("Failed to login with GitHub");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });
      if (error) setError(error.message);
    } catch {
      setError("Failed to login with Google");
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot Password ───────────────────────────────────────────────────────
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotSuccess(false);

    if (!forgotEmail) {
      setForgotError("Masukkan email kamu terlebih dahulu");
      return;
    }

    setForgotLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        forgotEmail,
        {
          redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
        },
      );

      if (resetError) {
        setForgotError(resetError.message);
      } else {
        setForgotSuccess(true);
      }
    } catch {
      setForgotError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setMode("login");
    setForgotEmail("");
    setForgotError(null);
    setForgotSuccess(false);
  };

  // ── Render: Forgot Password Mode ─────────────────────────────────────────
  if (mode === "forgot") {
    return (
      <div className={styles.main}>
        <div className={styles.loginCard}>
          <div className={styles.loginCard_header}>
            <img
              width="80"
              src="https://img.icons8.com/stickers/100/recycle-sign.png"
              alt="recycle-sign"
            />
            <h1>Lupa Password?</h1>
            <p>
              Masukkan email kamu dan kami akan mengirimkan link untuk reset
              password.
            </p>
          </div>

          {forgotSuccess ? (
            <div className={styles.successBox}>
              <div className={styles.successIcon}>✉️</div>
              <h3>Email Terkirim!</h3>
              <p>
                Link reset password telah dikirim ke <strong>{forgotEmail}</strong>.
                Periksa inbox (atau folder spam) kamu.
              </p>
              <button
                className={styles.loginCard_form_submitBtn}
                onClick={handleBackToLogin}
                style={{ marginTop: "1rem" }}
              >
                Kembali ke Login
              </button>
            </div>
          ) : (
            <div className={styles.loginCard_form}>
              {forgotError && (
                <div className={styles.errorBox}>⚠️ {forgotError}</div>
              )}
              <form onSubmit={handleForgotPassword}>
                <div className={styles.loginCard_form_group}>
                  <input
                    type="email"
                    placeholder="Masukkan email kamu"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    disabled={forgotLoading}
                    required
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className={styles.loginCard_form_submitBtn}
                  disabled={forgotLoading}
                >
                  {forgotLoading ? "Mengirim..." : "Kirim Link Reset"}
                </button>
              </form>

              <button
                className={styles.backBtn}
                onClick={handleBackToLogin}
                disabled={forgotLoading}
              >
                ← Kembali ke Login
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Render: Login Mode ────────────────────────────────────────────────────
  return (
    <div className={styles.main}>
      <div className={styles.loginCard}>
        <div className={styles.loginCard_header}>
          <img
            width="80"
            src="https://img.icons8.com/stickers/100/recycle-sign.png"
            alt="recycle-sign"
          />
          <h1>Welcome Back</h1>
          <p>please enter your credentials to sign in.</p>

          {error && (
            <div className={styles.errorBox}>⚠️ {error}</div>
          )}

          <div className={styles.loginCard_socials}>
            <ul>
              <li>
                <button
                  type="button"
                  className={styles.loginCard_socials_button}
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  title="Sign in with Google"
                >
                  <img
                    width="30"
                    height="30"
                    src="https://img.icons8.com/color/48/google-logo.png"
                    alt="google-logo"
                  />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={styles.loginCard_socials_button}
                  onClick={handleGitHubLogin}
                  disabled={loading}
                  title="Sign in with GitHub"
                >
                  <img
                    width="30"
                    src="https://img.icons8.com/fluency/48/github.png"
                    alt="github"
                  />
                </button>
              </li>
            </ul>
          </div>
          <div className={styles.loginCard_divider}>
            <span>or</span>
          </div>
        </div>

        <div className={styles.loginCard_form}>
          <form onSubmit={handleSubmit}>
            <div className={styles.loginCard_form_group}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className={styles.loginCard_form_group}>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  <img
                    width="25"
                    src={
                      showPassword
                        ? "https://img.icons8.com/sf-black-filled/64/invisible.png"
                        : "https://img.icons8.com/sf-black-filled/64/visible.png"
                    }
                    alt={showPassword ? "invisible" : "visible"}
                  />
                </button>
              </div>
            </div>
            <div className={styles.loginCard_form_options}>
              <label className={styles.rememberMe}>
                <input type="checkbox" disabled={loading} />
                Remember me
              </label>
              {/* Forgot Password trigger */}
              <button
                type="button"
                className={styles.forgotBtn}
                onClick={() => {
                  setForgotEmail(email);
                  setMode("forgot");
                }}
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>
            <button
              type="submit"
              className={styles.loginCard_form_submitBtn}
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>

        <div className={styles.loginCard_signUpLink}>
          Dont have an account? <Link href="/auth/register">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}
