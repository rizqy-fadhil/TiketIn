"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

// ─── Types ───────────────────────────────────────────────────────────────────
interface PromoCard {
  id: string;
  category: string;
  categoryColor: string;
  title: string;
  description: string;
  code: string;
  minTransaction: string;
  validUntil: string;
  discount: string;
  discountType: "percentage" | "cashback" | "free";
  badgeIcon: string;
}

// ─── Dummy data ───────────────────────────────────────────────────────────────
const PROMOS: PromoCard[] = [
  {
    id: "DOMEST15",
    category: "Tiket Pesawat",
    categoryColor: "primary",
    title: "Diskon 15% Rute Domestik",
    description:
      "Hemat 15% untuk semua penerbangan domestik! Nikmati perjalanan ke Bali, Lombok, Raja Ampat, dan destinasi populer lainnya dengan harga lebih terjangkau.",
    code: "DOMEST15",
    minTransaction: "Min. transaksi Rp500.000",
    validUntil: "Berlaku s/d 31 Agustus 2026",
    discount: "15%",
    discountType: "percentage",
    badgeIcon: "flight",
  },
  {
    id: "CASHBACK100",
    category: "Tiket Pesawat",
    categoryColor: "secondary",
    title: "Cashback Rp100.000 Penerbangan Internasional",
    description:
      "Dapatkan cashback Rp100.000 untuk pembelian tiket penerbangan internasional. Berlaku untuk semua rute internasional dari Indonesia.",
    code: "INTL100CB",
    minTransaction: "Min. transaksi Rp1.000.000",
    validUntil: "Berlaku s/d 15 September 2026",
    discount: "Rp100.000",
    discountType: "cashback",
    badgeIcon: "currency_exchange",
  },
  {
    id: "EARLYBIRD",
    category: "Tiket Pesawat",
    categoryColor: "tertiary",
    title: "Early Bird 20% Off Penerbangan Pagi",
    description:
      "Pesan tiket untuk penerbangan pukul 05.00–09.00 dan hemat 20%. Cocok untuk pelancong bisnis yang ingin tiba lebih awal di tujuan.",
    code: "EARLYBIRD20",
    minTransaction: "Min. transaksi Rp300.000",
    validUntil: "Berlaku s/d 30 September 2026",
    discount: "20%",
    discountType: "percentage",
    badgeIcon: "wb_sunny",
  },
  {
    id: "TIKETINFIRST",
    category: "Tiket Pesawat",
    categoryColor: "primary",
    title: "Diskon Pertama 10% untuk Member Baru",
    description:
      "Baru bergabung di TiketIn? Selamat datang! Gunakan kode ini untuk mendapatkan diskon 10% di transaksi pertama kamu.",
    code: "FIRSTFLY10",
    minTransaction: "Tanpa min. transaksi",
    validUntil: "Berlaku s/d 31 Desember 2026",
    discount: "10%",
    discountType: "percentage",
    badgeIcon: "celebration",
  },
  {
    id: "WEEKENDFUN",
    category: "Tiket Pesawat",
    categoryColor: "secondary",
    title: "Weekend Flash Sale – Diskon s/d 25%",
    description:
      "Flash sale setiap akhir pekan! Diskon hingga 25% untuk penerbangan yang dipesan Sabtu–Minggu. Stok terbatas, segera pesan!",
    code: "WEEKENDFLY",
    minTransaction: "Min. transaksi Rp400.000",
    validUntil: "Berlaku setiap Sabtu–Minggu",
    discount: "25%",
    discountType: "percentage",
    badgeIcon: "local_activity",
  },
  {
    id: "BAGGAGE0",
    category: "Tiket Pesawat",
    categoryColor: "tertiary",
    title: "Gratis Upgrade Bagasi 20 kg",
    description:
      "Nikmati upgrade bagasi gratis dari 10 kg ke 20 kg untuk penerbangan domestik pilihan. Bawa lebih banyak oleh-oleh tanpa khawatir biaya tambahan.",
    code: "BAGFREE20",
    minTransaction: "Min. transaksi Rp600.000",
    validUntil: "Berlaku s/d 31 Agustus 2026",
    discount: "Gratis Bagasi",
    discountType: "free",
    badgeIcon: "luggage",
  },
];

// ─── Promo Card Component ─────────────────────────────────────────────────────
function PromoCardItem({ promo }: { promo: PromoCard }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(promo.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      const el = document.createElement("textarea");
      el.value = promo.code;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const discountBg =
    promo.discountType === "cashback"
      ? "bg-secondary-container text-on-secondary-container"
      : promo.discountType === "free"
      ? "bg-surface-container-high text-on-surface"
      : "bg-primary-container text-on-primary-container";

  return (
    <div className="group bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-[0px_4px_12px_-2px_rgba(15,23,42,0.04)] hover:shadow-[0px_12px_28px_-4px_rgba(15,23,42,0.12)] hover:border-outline transition-all duration-300 overflow-hidden flex flex-col relative">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-primary to-surface-tint" />

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 gap-4">
        {/* Header: badge + discount chip */}
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 bg-surface-container text-on-surface-variant border border-outline-variant/70 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide uppercase">
            <span className="material-symbols-outlined text-primary text-[13px]">
              {promo.badgeIcon}
            </span>
            {promo.category}
          </span>
          <span
            className={`shrink-0 inline-flex items-center justify-center rounded-xl px-3 py-1 text-sm font-bold ${discountBg}`}
          >
            {promo.discount}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-headline-sm font-headline-sm text-on-surface leading-snug group-hover:text-primary transition-colors duration-200">
          {promo.title}
        </h2>

        {/* Description */}
        <p className="text-body-sm font-body-sm text-on-surface-variant flex-1 leading-relaxed">
          {promo.description}
        </p>

        {/* Promo code box */}
        <div className="bg-surface-container rounded-xl border border-dashed border-outline-variant/80 p-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold mb-1">
              Kode Promo
            </p>
            <p className="text-label-md font-label-md text-primary tracking-[0.15em] font-bold">
              {promo.code}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-label-sm font-label-sm transition-all duration-200 shrink-0 ${
              copied
                ? "bg-primary text-on-primary"
                : "bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">
              {copied ? "check" : "content_copy"}
            </span>
            {copied ? "Tersalin!" : "Salin"}
          </button>
        </div>

        {/* Terms */}
        <div className="flex flex-col gap-1 pt-1 border-t border-outline-variant/40">
          <p className="text-body-sm font-body-sm text-on-surface-variant flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-outline">
              info
            </span>
            {promo.minTransaction}
          </p>
          <p className="text-body-sm font-body-sm text-on-surface-variant flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-outline">
              calendar_month
            </span>
            {promo.validUntil}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PromoPage() {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section className="relative bg-gradient-to-br from-primary to-surface-tint overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />

          <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-24 text-center">
            <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white text-label-sm font-label-sm px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              <span className="material-symbols-outlined text-[15px]">
                local_offer
              </span>
              Penawaran Terbatas
            </span>
            <h1 className="text-display-lg font-display-lg text-white mb-4 leading-tight">
              Promo &amp; Penawaran Spesial
            </h1>
            <p className="text-body-lg font-body-lg text-white/80 max-w-xl mx-auto leading-relaxed">
              Temukan berbagai kode promo eksklusif untuk perjalanan impian kamu.
              Hemat lebih banyak, terbang lebih sering!
            </p>
          </div>
        </section>

        {/* ── Promo Grid ──────────────────────────────────────────────────── */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-headline-lg font-headline-lg text-on-surface">
                Semua Promo
              </h2>
              <p className="text-body-md font-body-md text-on-surface-variant mt-1">
                {PROMOS.length} promo tersedia untuk kamu
              </p>
            </div>
            <span className="hidden md:inline-flex items-center gap-1.5 text-body-sm font-body-sm text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-full border border-outline-variant/60">
              <span className="material-symbols-outlined text-[15px] text-primary">
                schedule
              </span>
              Diperbarui hari ini
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROMOS.map((promo) => (
              <PromoCardItem key={promo.id} promo={promo} />
            ))}
          </div>
        </section>

        {/* ── Info banner ─────────────────────────────────────────────────── */}
        <section className="bg-surface-container-low border-t border-outline-variant/50">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-primary text-3xl mt-0.5 shrink-0">
                help_outline
              </span>
              <div>
                <h3 className="text-headline-sm font-headline-sm text-on-surface mb-1">
                  Cara Menggunakan Promo
                </h3>
                <p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed max-w-md">
                  Salin kode promo, lalu masukkan di halaman pembayaran pada
                  kolom &ldquo;Kode Voucher / Promo&rdquo;. Diskon akan
                  otomatis teraplikasi.
                </p>
              </div>
            </div>
            <Link
              href="/bantuan"
              className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-lg text-label-md font-label-md hover:opacity-90 active:scale-95 transition-all duration-200 shrink-0 shadow-[0px_4px_8px_-2px_rgba(0,101,145,0.35)]"
            >
              <span className="material-symbols-outlined text-[18px]">
                support_agent
              </span>
              Butuh Bantuan?
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
