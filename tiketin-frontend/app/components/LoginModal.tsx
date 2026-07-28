"use client";

import { useEffect, useRef, useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useAuth } from "@/app/context/AuthContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // ── Tutup dengan Escape ───────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // ── Lock body scroll saat modal terbuka ───────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // ── Handler: Google Sign-In berhasil ──────────────────────────────────────
  async function handleGoogleSuccess(credentialResponse: CredentialResponse) {
    const idToken = credentialResponse.credential;
    if (!idToken) {
      setError("Gagal mendapatkan token dari Google. Coba lagi.");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? "Gagal login. Coba lagi.");
      }

      const data = await res.json() as { accessToken: string; user: { id: string; email: string; name: string } };
      login(data.accessToken, data.user);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsVerifying(false);
    }
  }

  function handleGoogleError() {
    setError("Login dengan Google dibatalkan atau gagal. Coba lagi.");
  }

  return (
    /* ── Overlay ── */
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      role="dialog"
      aria-modal="true"
      aria-label="Login ke TiketIn"
    >
      {/* ── Card ── */}
      <div
        className="relative w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: "var(--color-surface)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Gradient header strip ── */}
        <div
          className="h-1.5 w-full"
          style={{
            background: "linear-gradient(90deg, var(--color-primary), #3b82f6, var(--color-primary))",
          }}
        />

        {/* ── Tombol tutup ── */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:opacity-70"
          style={{ color: "var(--color-on-surface-variant)" }}
          aria-label="Tutup modal login"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* ── Konten ── */}
        <div className="px-8 pt-8 pb-10 flex flex-col items-center gap-6">
          {/* Logo + judul */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: "var(--color-primary)" }}
            >
              <span
                className="material-symbols-outlined text-[28px] material-symbols-fill"
                style={{ color: "var(--color-on-primary)" }}
              >
                flight
              </span>
            </div>
            <h2
              className="text-xl font-bold mt-1"
              style={{ color: "var(--color-on-surface)" }}
            >
              Masuk ke TiketIn
            </h2>
            <p
              className="text-sm text-center leading-snug"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              Kelola booking dan pantau penerbangan kamu dari satu tempat.
            </p>
          </div>

          {/* Divider */}
          <div className="w-full flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "var(--color-outline-variant)" }} />
            <span className="text-xs" style={{ color: "var(--color-on-surface-variant)" }}>
              Lanjutkan dengan
            </span>
            <div className="flex-1 h-px" style={{ background: "var(--color-outline-variant)" }} />
          </div>

          {/* Google Login button / loading state */}
          <div className="w-full flex flex-col items-center gap-3">
            {isVerifying ? (
              <div className="flex items-center gap-2 py-3">
                <div
                  className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: "var(--color-primary)", borderTopColor: "transparent" }}
                />
                <span className="text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
                  Memverifikasi…
                </span>
              </div>
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text="continue_with"
                shape="rectangular"
                size="large"
                width="280"
              />
            )}

            {/* Pesan error */}
            {error && (
              <div
                className="w-full flex items-start gap-2 rounded-lg px-3 py-2 text-sm"
                style={{
                  background: "color-mix(in srgb, var(--color-error) 12%, transparent)",
                  color: "var(--color-error)",
                  border: "1px solid color-mix(in srgb, var(--color-error) 30%, transparent)",
                }}
                role="alert"
              >
                <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">error</span>
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Catatan privasi */}
          <p
            className="text-xs text-center"
            style={{ color: "var(--color-on-surface-variant)", opacity: 0.7 }}
          >
            Dengan masuk, kamu menyetujui{" "}
            <span className="underline cursor-pointer">Syarat & Ketentuan</span> dan{" "}
            <span className="underline cursor-pointer">Kebijakan Privasi</span> TiketIn.
          </p>
        </div>
      </div>
    </div>
  );
}
