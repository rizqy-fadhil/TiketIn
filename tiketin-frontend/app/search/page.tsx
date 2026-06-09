import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hasil Pencarian Tiket - TiketIn",
};

const PROMO_BANNER_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBD0rfMkhFlcH5H_jehW-Regb8dEk5SVcoPvpZDQbiSBGo87h-e9-s-BIUO8t6pnJ-SO9ZUN1bjNfcztnmtEvF_c5nOQCdWZkFUnbUb6K32m28yElkm0cP0SWJpNZQDvJVnseZbsUQDFUP-Gu-fDbiqSYZjQ6DkWP4NtM_oGyy-aiGMZBG5WHszMmyu8enSvy4AvKBeO_lWz88PvO2z46fkTEy7NtENZks3kZ2RCMrsrQDdbs6tSuX8UofKIZVLN99uAGuHJOQkpSM";

export default function SearchResultsPage() {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-sans antialiased">
      <nav className="bg-surface dark:bg-on-surface docked full-width top-0 sticky z-50 border-b border-outline-variant dark:border-outline shadow-sm">
        <div className="flex justify-between items-center w-full px-margin-desktop max-w-container-max mx-auto h-16">
          <Link
            className="text-headline-md font-headline-md font-bold text-primary dark:text-inverse-primary tracking-tight"
            href="/"
          >
            TiketIn
          </Link>
          <div className="hidden md:flex space-x-gutter h-full items-center pt-2">
            <Link
              className="text-primary dark:text-inverse-primary border-b-2 border-primary dark:border-inverse-primary pb-1 text-label-md font-label-md transition-all"
              href="/search"
            >
              Cari Tiket
            </Link>
            <Link
              className="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary transition-colors duration-200 text-label-md font-label-md pb-[6px]"
              href="#"
            >
              Promo
            </Link>
            <Link
              className="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary transition-colors duration-200 text-label-md font-label-md pb-[6px]"
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

      <div className="w-full h-1 bg-surface-container">
        <div className="h-full bg-primary w-1/3" />
      </div>

      <div className="bg-surface-container-lowest border-b border-outline-variant py-stack-md z-40 sticky top-16 shadow-[0px_10px_15px_-3px_rgba(15,23,42,0.02)]">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-start md:items-center gap-stack-sm">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-stack-sm text-headline-md font-headline-md text-on-surface tracking-tight">
              <span>Surabaya (SUB)</span>
              <span className="material-symbols-outlined text-outline">
                arrow_right_alt
              </span>
              <span>Jakarta (JKT)</span>
            </div>
            <div className="flex items-center gap-stack-sm text-body-md font-body-md text-on-surface-variant flex-wrap">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px] text-tertiary">
                  calendar_today
                </span>{" "}
                12 Agt 2024
              </span>
              <span className="w-1 h-1 rounded-full bg-outline" />
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px] text-tertiary">
                  person
                </span>{" "}
                1 Penumpang
              </span>
              <span className="w-1 h-1 rounded-full bg-outline" />
              <span className="font-medium text-on-surface">Ekonomi</span>
            </div>
          </div>
          <button
            type="button"
            className="text-primary text-label-md font-label-md px-4 py-2 rounded border border-outline-variant hover:bg-surface-container-low transition-colors duration-200 mt-2 md:mt-0"
          >
            Ubah Pencarian
          </button>
        </div>
      </div>

      <main className="flex-1 max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg grid grid-cols-1 md:grid-cols-12 gap-gutter">
        <aside className="col-span-1 md:col-span-3 space-y-stack-md">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-stack-md shadow-[0px_4px_12px_-2px_rgba(15,23,42,0.03)]">
            <h2 className="text-label-md font-label-md text-on-surface mb-stack-md">
              Urutkan Berdasarkan
            </h2>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center bg-surface-container-lowest transition-colors">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                </div>
                <span className="text-body-md font-body-md text-on-surface group-hover:text-primary transition-colors">
                  Harga Terendah
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-5 h-5 rounded-full border-2 border-outline-variant flex items-center justify-center bg-surface-container-lowest group-hover:border-primary transition-colors">
                  <div className="w-2.5 h-2.5 rounded-full bg-transparent" />
                </div>
                <span className="text-body-md font-body-md text-on-surface-variant group-hover:text-primary transition-colors">
                  Keberangkatan Terawal
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-5 h-5 rounded-full border-2 border-outline-variant flex items-center justify-center bg-surface-container-lowest group-hover:border-primary transition-colors">
                  <div className="w-2.5 h-2.5 rounded-full bg-transparent" />
                </div>
                <span className="text-body-md font-body-md text-on-surface-variant group-hover:text-primary transition-colors">
                  Durasi Tercepat
                </span>
              </label>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-stack-md shadow-[0px_4px_12px_-2px_rgba(15,23,42,0.03)]">
            <h2 className="text-label-md font-label-md text-on-surface mb-stack-md">
              Transit
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="bg-primary text-on-primary px-4 py-2 rounded-full text-label-sm font-label-sm shadow-sm hover:opacity-90 transition-opacity"
              >
                Langsung
              </button>
              <button
                type="button"
                className="bg-surface text-on-surface-variant border border-outline-variant px-4 py-2 rounded-full text-label-sm font-label-sm hover:bg-surface-container-low hover:text-on-surface transition-colors"
              >
                1 Transit
              </button>
              <button
                type="button"
                className="bg-surface text-on-surface-variant border border-outline-variant px-4 py-2 rounded-full text-label-sm font-label-sm hover:bg-surface-container-low hover:text-on-surface transition-colors"
              >
                2+ Transit
              </button>
            </div>
          </div>

          <div
            className="bg-surface rounded-xl overflow-hidden shadow-[0px_10px_15px_-3px_rgba(15,23,42,0.05)] border border-outline-variant h-64 bg-cover bg-center relative"
            style={{ backgroundImage: `url('${PROMO_BANNER_IMAGE}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-stack-md">
              <span className="bg-primary text-on-primary px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider w-max mb-2">
                Penawaran Spesial
              </span>
              <h3 className="text-on-tertiary text-headline-sm font-headline-sm font-bold leading-tight">
                Diskon 20% Hotel di Jakarta
              </h3>
            </div>
          </div>
        </aside>

        <section className="col-span-1 md:col-span-9 space-y-stack-md">
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="text-body-sm font-body-sm text-on-surface-variant">
              Menampilkan 45 penerbangan terbaik
            </span>
          </div>

          {/* Card 1 — Garuda Indonesia */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-gutter shadow-[0px_10px_15px_-3px_rgba(15,23,42,0.02)] hover:shadow-[0px_10px_15px_-3px_rgba(15,23,42,0.08)] hover:border-outline transition-all duration-300 group flex flex-col md:flex-row justify-between items-stretch md:items-center gap-stack-md relative overflow-hidden backdrop-blur-sm">
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-300" />
            <div className="flex items-center gap-stack-md md:w-[28%] shrink-0">
              <div className="w-12 h-12 rounded bg-surface-container-low flex items-center justify-center shrink-0 border border-surface-variant">
                <span className="material-symbols-outlined text-primary text-2xl">
                  airlines
                </span>
              </div>
              <div className="flex flex-col">
                <h3 className="text-label-md font-label-md text-on-surface truncate">
                  Garuda Indonesia
                </h3>
                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  GA-304 • Ekonomi
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between flex-1 md:w-[42%] px-2">
              <div className="text-center shrink-0">
                <div className="text-headline-md font-headline-md text-on-surface">
                  08:00
                </div>
                <div className="text-label-sm font-label-sm text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded mt-1 inline-block">
                  SUB
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center px-4 relative min-w-[100px]">
                <span className="text-label-sm font-label-sm text-tertiary mb-2 font-medium">
                  1j 30m
                </span>
                <div className="w-full flex items-center relative">
                  <div className="h-[2px] bg-outline-variant/50 flex-1 rounded-l-full" />
                  <span className="material-symbols-outlined text-outline-variant text-[20px] mx-1 rotate-90 relative z-10 group-hover:text-primary transition-colors">
                    flight
                  </span>
                  <div className="h-[2px] bg-outline-variant/50 flex-1 rounded-r-full" />
                </div>
                <span className="text-label-sm font-label-sm text-primary mt-2">
                  Langsung
                </span>
              </div>
              <div className="text-center shrink-0">
                <div className="text-headline-md font-headline-md text-on-surface">
                  09:30
                </div>
                <div className="text-label-sm font-label-sm text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded mt-1 inline-block">
                  JKT
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end md:w-[30%] pt-stack-md md:pt-0 border-t md:border-t-0 border-outline-variant/50 md:border-l md:pl-gutter shrink-0">
              <div className="text-[20px] font-bold text-primary mb-3 tracking-tight">
                IDR 1.250.000
              </div>
              <Link 
                href="/book/GA-304" 
                className="bg-primary text-on-primary px-8 h-12 rounded-lg text-label-md font-label-md hover:bg-surface-tint w-full shadow-[0px_4px_6px_-1px_rgba(15,23,42,0.1)] active:scale-95 transition-all duration-200 flex justify-center items-center"
              >
                Pilih
              </Link>
            </div>
          </div>

          {/* Card 2 — Batik Air */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-gutter shadow-[0px_10px_15px_-3px_rgba(15,23,42,0.02)] hover:shadow-[0px_10px_15px_-3px_rgba(15,23,42,0.08)] hover:border-outline transition-all duration-300 group flex flex-col md:flex-row justify-between items-stretch md:items-center gap-stack-md relative overflow-hidden backdrop-blur-sm">
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-300" />
            <div className="flex items-center gap-stack-md md:w-[28%] shrink-0">
              <div className="w-12 h-12 rounded bg-surface-container-low flex items-center justify-center shrink-0 border border-surface-variant">
                <span className="material-symbols-outlined text-primary text-2xl">
                  flight_takeoff
                </span>
              </div>
              <div className="flex flex-col">
                <h3 className="text-label-md font-label-md text-on-surface truncate">
                  Batik Air
                </h3>
                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  ID-6571 • Bisnis
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between flex-1 md:w-[42%] px-2">
              <div className="text-center shrink-0">
                <div className="text-headline-md font-headline-md text-on-surface">
                  10:15
                </div>
                <div className="text-label-sm font-label-sm text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded mt-1 inline-block">
                  SUB
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center px-4 relative min-w-[100px]">
                <span className="text-label-sm font-label-sm text-tertiary mb-2 font-medium">
                  1j 35m
                </span>
                <div className="w-full flex items-center relative">
                  <div className="h-[2px] bg-outline-variant/50 flex-1 rounded-l-full" />
                  <span className="material-symbols-outlined text-outline-variant text-[20px] mx-1 rotate-90 relative z-10 group-hover:text-primary transition-colors">
                    flight
                  </span>
                  <div className="h-[2px] bg-outline-variant/50 flex-1 rounded-r-full" />
                </div>
                <span className="text-label-sm font-label-sm text-primary mt-2">
                  Langsung
                </span>
              </div>
              <div className="text-center shrink-0">
                <div className="text-headline-md font-headline-md text-on-surface">
                  11:50
                </div>
                <div className="text-label-sm font-label-sm text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded mt-1 inline-block">
                  JKT
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end md:w-[30%] pt-stack-md md:pt-0 border-t md:border-t-0 border-outline-variant/50 md:border-l md:pl-gutter shrink-0">
              <div className="text-[20px] font-bold text-primary mb-3 tracking-tight">
                IDR 2.450.000
              </div>
              <Link 
                href="/book/GA-304" 
                className="bg-primary text-on-primary px-8 h-12 rounded-lg text-label-md font-label-md hover:bg-surface-tint w-full shadow-[0px_4px_6px_-1px_rgba(15,23,42,0.1)] active:scale-95 transition-all duration-200 flex justify-center items-center"
              >
                Pilih
              </Link>
            </div>
          </div>

          {/* Card 3 — Lion Air */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-gutter shadow-[0px_10px_15px_-3px_rgba(15,23,42,0.02)] hover:shadow-[0px_10px_15px_-3px_rgba(15,23,42,0.08)] hover:border-outline transition-all duration-300 group flex flex-col md:flex-row justify-between items-stretch md:items-center gap-stack-md relative overflow-hidden backdrop-blur-sm">
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-300" />
            <div className="flex items-center gap-stack-md md:w-[28%] shrink-0">
              <div className="w-12 h-12 rounded bg-surface-container-low flex items-center justify-center shrink-0 border border-surface-variant">
                <span className="material-symbols-outlined text-primary text-2xl">
                  flight_class
                </span>
              </div>
              <div className="flex flex-col">
                <h3 className="text-label-md font-label-md text-on-surface truncate">
                  Lion Air
                </h3>
                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  JT-599 • Ekonomi
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between flex-1 md:w-[42%] px-2">
              <div className="text-center shrink-0">
                <div className="text-headline-md font-headline-md text-on-surface">
                  14:30
                </div>
                <div className="text-label-sm font-label-sm text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded mt-1 inline-block">
                  SUB
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center px-4 relative min-w-[100px]">
                <span className="text-label-sm font-label-sm text-tertiary mb-2 font-medium">
                  1j 40m
                </span>
                <div className="w-full flex items-center relative">
                  <div className="h-[2px] bg-outline-variant/50 flex-1 rounded-l-full" />
                  <span className="material-symbols-outlined text-outline-variant text-[20px] mx-1 rotate-90 relative z-10 group-hover:text-primary transition-colors">
                    flight
                  </span>
                  <div className="h-[2px] bg-outline-variant/50 flex-1 rounded-r-full" />
                </div>
                <span className="text-label-sm font-label-sm text-primary mt-2">
                  Langsung
                </span>
              </div>
              <div className="text-center shrink-0">
                <div className="text-headline-md font-headline-md text-on-surface">
                  16:10
                </div>
                <div className="text-label-sm font-label-sm text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded mt-1 inline-block">
                  JKT
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end md:w-[30%] pt-stack-md md:pt-0 border-t md:border-t-0 border-outline-variant/50 md:border-l md:pl-gutter shrink-0">
              <div className="text-[20px] font-bold text-primary mb-3 tracking-tight">
                IDR 980.000
              </div>
              <Link 
                href="/book/GA-304" 
                className="bg-primary text-on-primary px-8 h-12 rounded-lg text-label-md font-label-md hover:bg-surface-tint w-full shadow-[0px_4px_6px_-1px_rgba(15,23,42,0.1)] active:scale-95 transition-all duration-200 flex justify-center items-center"
              >
                Pilih
              </Link>
            </div>
          </div>

          <div className="flex justify-center mt-stack-lg pt-4">
            <button
              type="button"
              className="bg-surface-container-low text-primary border border-primary/20 px-8 py-3 rounded-lg text-label-md font-label-md hover:bg-surface-container hover:border-primary transition-colors duration-200 shadow-sm"
            >
              Muat Lebih Banyak
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-surface-container-lowest dark:bg-inverse-surface border-t border-outline-variant dark:border-outline mt-auto w-full py-stack-lg px-margin-desktop max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center flat no shadows">
        <div className="text-headline-sm font-headline-sm font-bold text-on-surface dark:text-inverse-on-surface mb-stack-md md:mb-0">
          TiketIn
        </div>
        <div className="flex flex-wrap justify-center gap-stack-md mb-stack-md md:mb-0">
          <Link
            className="text-on-surface-variant dark:text-surface-variant text-label-sm font-label-sm hover:underline hover:text-primary dark:hover:text-inverse-primary transition-colors"
            href="#"
          >
            Tentang Kami
          </Link>
          <Link
            className="text-on-surface-variant dark:text-surface-variant text-label-sm font-label-sm hover:underline hover:text-primary dark:hover:text-inverse-primary transition-colors"
            href="#"
          >
            Pusat Bantuan
          </Link>
          <Link
            className="text-on-surface-variant dark:text-surface-variant text-label-sm font-label-sm hover:underline hover:text-primary dark:hover:text-inverse-primary transition-colors"
            href="#"
          >
            Syarat & Ketentuan
          </Link>
          <Link
            className="text-on-surface-variant dark:text-surface-variant text-label-sm font-label-sm hover:underline hover:text-primary dark:hover:text-inverse-primary transition-colors"
            href="#"
          >
            Kebijakan Privasi
          </Link>
        </div>
        <div className="text-body-sm font-body-sm text-on-surface-variant dark:text-surface-variant text-center md:text-right">
          © 2024 TiketIn. Solusi Perjalanan Modern.
        </div>
      </footer>
    </div>
  );
}
