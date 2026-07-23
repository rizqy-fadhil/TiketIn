"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import FlightSearchWidget from "@/app/components/FlightSearchWidget";
import FlightResultsList, { ListState } from "./components/FlightResultsList";
import { INDONESIAN_AIRPORTS } from "@/app/lib/airports";
import { DuffelOffer } from "@/app/lib/duffelHelpers";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

// ─── Inner page (needs useSearchParams, must be wrapped in Suspense) ──────────

function FlightSearchInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paramOrigin = searchParams.get("origin") ?? "";
  const paramDestination = searchParams.get("destination") ?? "";
  const paramDate = searchParams.get("date") ?? "";

  const hasValidParams =
    paramOrigin.length === 3 &&
    paramDestination.length === 3 &&
    /^\d{4}-\d{2}-\d{2}$/.test(paramDate);

  const [listState, setListState] = useState<ListState>({ status: "idle" });

  // ── Fetch function ─────────────────────────────────────────────────────────
  const doFetch = useCallback(async (origin: string, destination: string, date: string) => {
    setListState({ status: "loading" });

    try {
      const url =
        `${API_BASE}/api/flights/search` +
        `?origin=${encodeURIComponent(origin)}` +
        `&destination=${encodeURIComponent(destination)}` +
        `&date=${encodeURIComponent(date)}`;

      const res = await fetch(url);

      // HTTP 400 — class-validator array
      if (res.status === 400) {
        const body = await res.json();
        const messages: string[] = Array.isArray(body.message)
          ? body.message
          : [body.message ?? "Permintaan tidak valid."];
        setListState({ status: "error", message: messages.join(" ") });
        return;
      }

      // Other non-2xx
      if (!res.ok) {
        setListState({
          status: "error",
          message: `Server mengembalikan error ${res.status}. Silakan coba lagi.`,
        });
        return;
      }

      const body = await res.json();

      // status:"error" inside 200
      if (body.status === "error") {
        setListState({ status: "error", message: body.message ?? "Terjadi kesalahan." });
        return;
      }

      const data: DuffelOffer[] = Array.isArray(body.data) ? body.data : [];
      setListState({ status: "success", data });
    } catch {
      setListState({
        status: "error",
        message: "Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba lagi.",
      });
    }
  }, []);

  // ── Auto-fetch on mount / when URL params change ───────────────────────────
  useEffect(() => {
    if (hasValidParams) {
      doFetch(paramOrigin, paramDestination, paramDate);
    } else {
      setListState({ status: "idle" });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramOrigin, paramDestination, paramDate]);

  // ── Called by compact widget's onSearch prop ───────────────────────────────
  function handleSearch(origin: string, destination: string, date: string) {
    // Update URL (triggers useEffect above which re-fetches)
    const params = new URLSearchParams({ origin, destination, date });
    router.push(`/flights/search?${params.toString()}`);
  }

  // ── Helpers for summary display ────────────────────────────────────────────
  function airportLabel(iata: string) {
    const found = INDONESIAN_AIRPORTS.find((a) => a.iata === iata);
    return found ? `${iata} – ${found.city}` : iata;
  }

  function formatDateDisplay(dateStr: string) {
    if (!dateStr) return "";
    try {
      return new Date(dateStr + "T00:00:00").toLocaleDateString("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  }

  const isLoading = listState.status === "loading";

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-sans antialiased">
      {/* ─── Nav ────────────────────────────────────────────────────────────── */}
      <nav className="bg-surface sticky top-0 z-50 border-b border-outline-variant shadow-sm">
        <div className="flex justify-between items-center w-full px-4 md:px-margin-desktop max-w-container-max mx-auto h-16">
          <Link
            className="text-headline-md font-headline-md font-bold text-primary tracking-tight"
            href="/"
          >
            TiketIn
          </Link>
          <div className="hidden md:flex space-x-gutter h-full items-center pt-2">
            <Link
              className="text-primary border-b-2 border-primary pb-1 text-label-md font-label-md"
              href="/flights/search"
            >
              Cari Tiket
            </Link>
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors duration-200 text-label-md font-label-md pb-[6px]"
              href="#"
            >
              Promo
            </Link>
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors duration-200 text-label-md font-label-md pb-[6px]"
              href="#"
            >
              Bantuan
            </Link>
          </div>
          <div className="flex items-center space-x-stack-sm">
            <button
              type="button"
              className="text-primary hover:text-surface-tint text-label-md font-label-md px-4 py-2 transition-colors duration-200"
            >
              Login
            </button>
            <button
              type="button"
              className="bg-primary text-on-primary text-label-md font-label-md px-5 h-10 rounded hover:opacity-90 transition-all duration-200 shadow-[0px_4px_6px_-1px_rgba(15,23,42,0.1)] active:scale-95"
            >
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Compact search bar (sticky below nav) ───────────────────────────── */}
      <div className="bg-surface-container-lowest border-b border-outline-variant sticky top-16 z-40 shadow-[0px_4px_12px_-4px_rgba(15,23,42,0.06)]">
        <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-3">
          {/* Route summary line (shown when params present) */}
          {hasValidParams && (
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="material-symbols-outlined text-primary text-[16px]">flight</span>
              <span className="text-body-sm font-body-sm font-semibold text-on-surface">
                {airportLabel(paramOrigin)}
              </span>
              <span className="material-symbols-outlined text-outline text-[14px]">arrow_right_alt</span>
              <span className="text-body-sm font-body-sm font-semibold text-on-surface">
                {airportLabel(paramDestination)}
              </span>
              <span className="w-1 h-1 rounded-full bg-outline mx-0.5" />
              <span className="text-body-sm font-body-sm text-on-surface-variant">
                {formatDateDisplay(paramDate)}
              </span>
            </div>
          )}

          {/* Compact widget — pre-filled from URL params */}
          <FlightSearchWidget
            mode="compact"
            initialOrigin={paramOrigin}
            initialDestination={paramDestination}
            initialDate={paramDate}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* ─── Results ─────────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-container-max w-full mx-auto px-4 md:px-margin-desktop py-stack-lg">
        {listState.status === "idle" ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="material-symbols-outlined text-outline text-6xl mb-4">
              travel_explore
            </span>
            <h1 className="text-headline-sm font-headline-sm text-on-surface mb-2">
              Mulai Pencarian Anda
            </h1>
            <p className="text-body-md font-body-md text-on-surface-variant max-w-sm">
              Isi form di atas untuk menemukan penerbangan terbaik untuk perjalanan Anda.
            </p>
          </div>
        ) : (
          <FlightResultsList state={listState} />
        )}
      </main>

      {/* ─── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant mt-auto w-full py-stack-lg px-4 md:px-margin-desktop max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-headline-sm font-headline-sm font-bold text-on-surface">TiketIn</div>
        <div className="flex flex-wrap justify-center gap-stack-md">
          {["Tentang Kami", "Pusat Bantuan", "Syarat & Ketentuan", "Kebijakan Privasi"].map(
            (label) => (
              <Link
                key={label}
                className="text-on-surface-variant text-label-sm font-label-sm hover:underline hover:text-primary transition-colors"
                href="#"
              >
                {label}
              </Link>
            )
          )}
        </div>
        <div className="text-body-sm font-body-sm text-on-surface-variant">
          © 2024 TiketIn. Solusi Perjalanan Modern.
        </div>
      </footer>
    </div>
  );
}

// ─── Exported page — wraps inner in Suspense for useSearchParams ──────────────

export default function FlightSearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <span className="w-8 h-8 border-4 border-outline-variant border-t-primary rounded-full animate-spin" />
        </div>
      }
    >
      <FlightSearchInner />
    </Suspense>
  );
}
