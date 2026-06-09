import Image from "next/image";
import Link from 'next/link';

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAiUBfBPwUH0I_bbc2QoMRA55YTjRkx3p0fNF8jarkkp9TK-7kKsVbMnyeM2-Gbi_trvAkF6HekoOZoRt0L_aNriod6qmShnASA5h2CIGotF96X4MT52VEInmY8ES5-dfj0VDRb_AzM-y_dM8iFEioHRXcfuGXM3E4pjmlxIc3CWThUbjNvCdseBAdjR9OzjHZ9M8l6BIDtNwArzpApPE6yO7mQd-3lwKlrkuekTk-YJS2rq31Wk4mC4pjar_63C7XhGr5IRas7MfA";

export default function HeroSection() {
  return (
    <section className="relative pt-24 pb-32 px-margin-mobile md:px-margin-desktop overflow-hidden flex flex-col items-center justify-center min-h-[600px] bg-gradient-to-b from-surface-container-high to-background">
      <div className="absolute inset-0 z-0">
        <Image
          alt="Airplane wing over clouds"
          src={HERO_IMAGE}
          fill
          className="object-cover opacity-20"
          priority
          sizes="100vw"
        />
      </div>
      <div className="relative z-10 max-w-3xl text-center mb-12">
        <h1 className="text-display-lg font-display-lg text-on-surface mb-stack-md">
          Jelajahi Dunia Bersama TiketIn
        </h1>
        <p className="text-body-lg font-body-lg text-on-surface-variant">
          Temukan penerbangan terbaik dengan harga transparan dan proses booking
          yang cepat.
        </p>
      </div>
      <div className="relative z-20 w-full max-w-5xl glass-panel rounded-xl p-6 md:p-8">
        <div className="flex gap-4 mb-6 border-b border-outline-variant/50 pb-4">
          <button
            type="button"
            className="flex items-center gap-2 text-primary border-b-2 border-primary pb-1 font-label-md text-label-md"
          >
            <span className="material-symbols-outlined text-[20px] material-symbols-fill">
              flight
            </span>
            Pesawat
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-3 relative">
            <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">
              Asal
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                flight_takeoff
              </span>
              <input
                className="w-full h-12 pl-10 pr-4 bg-surface rounded border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-body-md font-body-md text-on-surface placeholder:text-outline/70"
                placeholder="Jakarta (CGK)"
                type="text"
              />
            </div>
          </div>
          <div className="hidden md:flex md:col-span-1 items-center justify-center pt-6">
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-primary transition-colors border border-outline-variant"
            >
              <span className="material-symbols-outlined">swap_horiz</span>
            </button>
          </div>
          <div className="md:col-span-3 relative">
            <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">
              Tujuan
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                flight_land
              </span>
              <input
                className="w-full h-12 pl-10 pr-4 bg-surface rounded border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-body-md font-body-md text-on-surface placeholder:text-outline/70"
                placeholder="Bali (DPS)"
                type="text"
              />
            </div>
          </div>
          <div className="md:col-span-2 relative">
            <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">
              Tanggal Pergi
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                calendar_month
              </span>
              <input
                className="w-full h-12 pl-10 pr-4 bg-surface rounded border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-body-md font-body-md text-on-surface placeholder:text-outline/70 cursor-pointer"
                placeholder="12 Nov 2024"
                type="text"
              />
            </div>
          </div>
          <div className="md:col-span-3 relative">
            <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">
              Penumpang & Kelas
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                person
              </span>
              <div className="w-full h-12 pl-10 pr-4 bg-surface rounded border border-outline-variant flex items-center justify-between cursor-pointer">
                <span className="text-body-md font-body-md text-on-surface">
                  1 Dewasa, Ekonomi
                </span>
                <span className="material-symbols-outlined text-outline">
                  expand_more
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <Link 
            href="/search"
            className="bg-primary text-on-primary h-12 px-8 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-[0px_4px_10px_rgba(0,101,145,0.2)]"
          >
            <span className="material-symbols-outlined">search</span>
            <span className="text-label-md font-label-md">Cari Tiket</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
