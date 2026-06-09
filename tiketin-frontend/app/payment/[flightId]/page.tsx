"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

type PaymentPageProps = {
  params: Promise<{ flightId: string }>;
};

function formatCountdown(totalSeconds: number): string {
  if (totalSeconds <= 0) return "00:00";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

export default function PaymentPage({ params }: PaymentPageProps) {
  const { flightId } = use(params);
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 59);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col antialiased">
      <nav className="bg-surface dark:bg-on-surface border-b border-outline-variant dark:border-outline docked full-width top-0 z-50">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto h-16">
          <div className="flex items-center gap-4">
            <Link
              className="text-headline-md font-headline-md font-bold text-primary dark:text-inverse-primary tracking-tight"
              href="/"
            >
              TiketIn
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link
              className="text-on-surface-variant dark:text-surface-variant text-label-md font-label-md hover:text-primary dark:hover:text-inverse-primary transition-colors duration-200"
              href="/search"
            >
              Cari Tiket
            </Link>
            <Link
              className="text-on-surface-variant dark:text-surface-variant text-label-md font-label-md hover:text-primary dark:hover:text-inverse-primary transition-colors duration-200"
              href="#"
            >
              Promo
            </Link>
            <Link
              className="text-on-surface-variant dark:text-surface-variant text-label-md font-label-md hover:text-primary dark:hover:text-inverse-primary transition-colors duration-200"
              href="#"
            >
              Bantuan
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="hidden md:block text-label-md font-label-md text-primary dark:text-inverse-primary px-4 py-2 rounded-full hover:bg-surface-variant transition-colors"
            >
              Login
            </button>
            <button
              type="button"
              className="text-label-md font-label-md bg-primary text-on-primary px-5 py-2 rounded-full hover:bg-surface-tint transition-all opacity-80 scale-95 cursor-not-allowed"
              disabled
            >
              Register
            </button>
          </div>
        </div>
      </nav>

      <div className="bg-error-container w-full py-3 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto flex items-center justify-center gap-2 text-on-error-container">
          <span className="material-symbols-outlined material-symbols-fill">
            timer
          </span>
          <span className="font-label-md text-label-md">
            Selesaikan Pembayaran dalam{" "}
            <span className="font-bold tabular-nums" id="countdown-timer">
              {formatCountdown(timeLeft)}
            </span>
          </span>
        </div>
      </div>

      <main className="flex-grow w-full px-margin-mobile md:px-margin-desktop py-stack-lg max-w-container-max mx-auto">
        <div className="mb-stack-lg flex items-center justify-between max-w-3xl mx-auto relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-surface-variant -z-10 rounded-full transform -translate-y-1/2" />
          <div className="absolute top-1/2 left-0 w-2/3 h-1 bg-primary -z-10 rounded-full transform -translate-y-1/2" />
          <div className="flex flex-col items-center gap-2 bg-background px-2">
            <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[18px]">check</span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Pesan
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 bg-background px-2">
            <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-sm text-label-sm ring-4 ring-primary-fixed">
              2
            </div>
            <span className="font-label-sm text-label-sm text-primary font-bold">
              Bayar
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 bg-background px-2">
            <div className="w-8 h-8 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center font-label-sm text-label-sm">
              3
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Selesai
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          <div className="lg:col-span-8 flex flex-col gap-stack-md">
            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-stack-sm">
              Metode Pembayaran
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="cursor-pointer relative group">
                <input
                  defaultChecked
                  className="peer sr-only"
                  name="payment_method"
                  type="radio"
                  value="va"
                />
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md soft-shadow h-full transition-all peer-checked:border-primary peer-checked:bg-primary-fixed/20 peer-checked:ring-1 peer-checked:ring-primary hover:border-outline">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">
                          account_balance
                        </span>
                      </div>
                      <div>
                        <h3 className="font-label-md text-label-md text-on-surface">
                          Virtual Account
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          BCA, Mandiri, BNI
                        </p>
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-outline-variant flex items-center justify-center peer-checked:group-[]:border-primary">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary scale-0 transition-transform peer-checked:group-[]:scale-100" />
                    </div>
                  </div>
                  <div
                    className="mt-4 pt-4 border-t border-outline-variant/50 grid grid-cols-2 gap-2"
                    id="va-options"
                  >
                    <div className="border border-outline-variant rounded-lg p-2 flex items-center justify-center gap-2 hover:bg-surface-variant cursor-pointer transition-colors bg-surface-container-lowest">
                      <span className="font-label-sm text-label-sm">BCA VA</span>
                    </div>
                    <div className="border border-outline-variant rounded-lg p-2 flex items-center justify-center gap-2 hover:bg-surface-variant cursor-pointer transition-colors bg-surface-container-lowest border-primary bg-primary-fixed/30">
                      <span className="font-label-sm text-label-sm">
                        Mandiri VA
                      </span>
                    </div>
                  </div>
                </div>
              </label>

              <label className="cursor-pointer relative group">
                <input
                  className="peer sr-only"
                  name="payment_method"
                  type="radio"
                  value="qris"
                />
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md soft-shadow h-full transition-all peer-checked:border-primary peer-checked:bg-primary-fixed/20 peer-checked:ring-1 peer-checked:ring-primary hover:border-outline">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">
                          qr_code_scanner
                        </span>
                      </div>
                      <div>
                        <h3 className="font-label-md text-label-md text-on-surface">
                          QRIS
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Gopay, OVO, Dana
                        </p>
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-outline-variant flex items-center justify-center peer-checked:group-[]:border-primary">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary scale-0 transition-transform peer-checked:group-[]:scale-100" />
                    </div>
                  </div>
                </div>
              </label>

              <label className="cursor-pointer relative group md:col-span-2">
                <input
                  className="peer sr-only"
                  name="payment_method"
                  type="radio"
                  value="cc"
                />
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md soft-shadow h-full transition-all peer-checked:border-primary peer-checked:bg-primary-fixed/20 peer-checked:ring-1 peer-checked:ring-primary hover:border-outline">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">
                          credit_card
                        </span>
                      </div>
                      <div>
                        <h3 className="font-label-md text-label-md text-on-surface">
                          Kartu Kredit / Debit
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Visa, Mastercard, JCB
                        </p>
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-outline-variant flex items-center justify-center peer-checked:group-[]:border-primary">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary scale-0 transition-transform peer-checked:group-[]:scale-100" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-outline-variant/50 space-y-4 opacity-50 pointer-events-none group-[:has(:checked)]:opacity-100 group-[:has(:checked)]:pointer-events-auto transition-opacity">
                    <div>
                      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                        Nomor Kartu
                      </label>
                      <div className="relative">
                        <input
                          className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                          placeholder="0000 0000 0000 0000"
                          type="text"
                        />
                        <span className="material-symbols-outlined absolute right-3 top-1/2 transform -translate-y-1/2 text-outline-variant">
                          credit_score
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                          Masa Berlaku
                        </label>
                        <input
                          className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                          placeholder="MM/YY"
                          type="text"
                        />
                      </div>
                      <div>
                        <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                          CVV
                        </label>
                        <input
                          className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                          placeholder="123"
                          type="password"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="lg:col-span-4 sticky top-24">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg soft-shadow flex flex-col gap-6">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface mb-2">
                  Rincian Pesanan
                </h2>
                <div className="flex items-center gap-2 text-on-surface-variant bg-surface-variant/50 p-3 rounded-lg">
                  <span className="material-symbols-outlined text-primary">
                    flight_takeoff
                  </span>
                  <span className="font-label-sm text-label-sm flex-grow">
                    Jakarta (CGK)
                  </span>
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_forward
                  </span>
                  <span className="font-label-sm text-label-sm">Bali (DPS)</span>
                </div>
              </div>
              <div className="space-y-3 font-body-sm text-body-sm text-on-surface-variant">
                <div className="flex justify-between">
                  <span>Harga Dasar (1x Penumpang)</span>
                  <span className="font-medium text-on-surface">
                    Rp 1.250.000
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Pajak & Biaya Layanan</span>
                  <span className="font-medium text-on-surface">Rp 125.000</span>
                </div>
                <div className="flex justify-between text-primary">
                  <span>Asuransi Perjalanan</span>
                  <span>Termasuk</span>
                </div>
              </div>
              <div className="border-t border-dashed border-outline-variant pt-4 flex justify-between items-end">
                <span className="font-label-md text-label-md text-on-surface">
                  Total Pembayaran
                </span>
                <span className="font-headline-md text-headline-md text-primary">
                  Rp 1.375.000
                </span>
              </div>
              <Link
                href={`/e-ticket/${flightId}`}
                className="w-full bg-primary text-on-primary font-label-md text-label-md h-12 rounded-full hover:bg-surface-tint transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined material-symbols-fill">
                  lock
                </span>
                Bayar Sekarang
              </Link>
              <div className="flex items-center justify-center gap-4 pt-2 border-t border-surface-variant">
                <div className="flex items-center gap-1 text-outline">
                  <span className="material-symbols-outlined text-[18px]">
                    gpp_good
                  </span>
                  <span className="font-label-sm text-[10px] uppercase tracking-wider">
                    SSL Secure
                  </span>
                </div>
                <div className="flex items-center gap-1 text-outline">
                  <span className="material-symbols-outlined text-[18px]">
                    verified_user
                  </span>
                  <span className="font-label-sm text-[10px] uppercase tracking-wider">
                    Trusted
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-surface-container-lowest dark:bg-inverse-surface border-t border-outline-variant dark:border-outline full-width mt-auto">
        <div className="w-full py-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-stack-md">
          <div className="text-headline-sm font-headline-sm font-bold text-on-surface dark:text-inverse-on-surface flex items-center gap-2">
            © 2024 TiketIn. Solusi Perjalanan Modern.
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            <Link
              className="text-on-surface-variant dark:text-surface-variant text-label-sm font-label-sm hover:underline hover:text-primary dark:hover:text-inverse-primary"
              href="#"
            >
              Tentang Kami
            </Link>
            <Link
              className="text-on-surface-variant dark:text-surface-variant text-label-sm font-label-sm hover:underline hover:text-primary dark:hover:text-inverse-primary"
              href="#"
            >
              Pusat Bantuan
            </Link>
            <Link
              className="text-on-surface-variant dark:text-surface-variant text-label-sm font-label-sm hover:underline hover:text-primary dark:hover:text-inverse-primary"
              href="#"
            >
              Syarat & Ketentuan
            </Link>
            <Link
              className="text-on-surface-variant dark:text-surface-variant text-label-sm font-label-sm hover:underline hover:text-primary dark:hover:text-inverse-primary"
              href="#"
            >
              Kebijakan Privasi
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
