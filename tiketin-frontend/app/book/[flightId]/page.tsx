import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TiketIn - Form Pemesanan",
};

type BookPageProps = {
  params: Promise<{ flightId: string }>;
};

export default async function BookPage({ params }: BookPageProps) {
  const { flightId } = await params;

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-headline-md font-headline-md font-bold text-primary"
            >
              TiketIn
            </Link>
          </div>
          <nav className="hidden md:flex space-x-gutter">
            <Link
              className="text-on-surface-variant text-label-md font-label-md hover:text-primary transition-colors duration-200"
              href="/search"
            >
              Cari Tiket
            </Link>
            <Link
              className="text-on-surface-variant text-label-md font-label-md hover:text-primary transition-colors duration-200"
              href="#"
            >
              Promo
            </Link>
            <Link
              className="text-on-surface-variant text-label-md font-label-md hover:text-primary transition-colors duration-200"
              href="#"
            >
              Bantuan
            </Link>
          </nav>
          <div className="flex items-center space-x-stack-md">
            <button
              type="button"
              className="hidden md:block text-primary text-label-md font-label-md hover:opacity-80 transition-opacity"
            >
              Login
            </button>
            <button
              type="button"
              className="bg-primary text-on-primary text-label-md font-label-md px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      <div className="fixed top-16 w-full h-1 bg-surface-container z-40">
        <div className="h-full bg-primary w-1/3" />
      </div>

      <main className="flex-grow pt-24 pb-stack-lg px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto">
        <div className="mb-stack-lg">
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-surface">
            Detail Pemesanan
          </h1>
          <p className="text-body-md font-body-md text-on-surface-variant mt-1">
            Pastikan data yang diisi sesuai dengan kartu identitas Anda.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          <div className="lg:col-span-8 flex flex-col space-y-gutter">
            <section className="bg-surface rounded-xl border border-tertiary-fixed shadow-[0px_10px_15px_-3px_rgba(15,23,42,0.05)] overflow-hidden">
              <div className="bg-surface-container-lowest border-b border-tertiary-fixed px-6 py-4 flex items-center space-x-3">
                <span className="material-symbols-outlined text-primary material-symbols-fill">
                  person
                </span>
                <h2 className="text-headline-md font-headline-md text-on-surface">
                  Data Pemesan
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                  <div className="flex flex-col space-y-2 md:col-span-2">
                    <label className="text-label-sm font-label-sm text-on-surface-variant">
                      Nama Lengkap Pemesan
                    </label>
                    <input
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="Cth: John Doe"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-label-sm font-label-sm text-on-surface-variant">
                      Alamat Email
                    </label>
                    <input
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="email@contoh.com"
                      type="email"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-label-sm font-label-sm text-on-surface-variant">
                      Nomor Telepon
                    </label>
                    <div className="flex w-full">
                      <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-outline-variant bg-surface-container-lowest text-on-surface-variant text-body-md font-body-md">
                        +62
                      </span>
                      <input
                        className="w-full bg-surface-container-lowest border border-outline-variant rounded-r-lg px-4 py-3 text-body-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="8123456789"
                        type="tel"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-surface rounded-xl border border-tertiary-fixed shadow-[0px_10px_15px_-3px_rgba(15,23,42,0.05)] overflow-hidden">
              <div className="bg-surface-container-lowest border-b border-tertiary-fixed px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="material-symbols-outlined text-primary material-symbols-fill">
                    airline_seat_recline_normal
                  </span>
                  <h2 className="text-headline-md font-headline-md text-on-surface">
                    Data Penumpang 1
                  </h2>
                </div>
                <span className="text-label-sm font-label-sm text-primary bg-primary-fixed px-2 py-1 rounded">
                  Dewasa
                </span>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
                  <div className="flex flex-col space-y-2 md:col-span-1">
                    <label className="text-label-sm font-label-sm text-on-surface-variant">
                      Titel
                    </label>
                    <select className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none cursor-pointer">
                      <option>Tuan</option>
                      <option>Nyonya</option>
                      <option>Nona</option>
                    </select>
                  </div>
                  <div className="flex flex-col space-y-2 md:col-span-2">
                    <label className="text-label-sm font-label-sm text-on-surface-variant">
                      Nama Lengkap (Sesuai KTP/Paspor)
                    </label>
                    <input
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="Cth: John Doe"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col space-y-2 md:col-span-3">
                    <label className="text-label-sm font-label-sm text-on-surface-variant">
                      Nomor Identitas (KTP/Paspor)
                    </label>
                    <input
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="Masukkan 16 digit NIK / Nomor Paspor"
                      type="text"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="bg-surface rounded-xl border border-tertiary-fixed shadow-[0px_10px_15px_-3px_rgba(15,23,42,0.05)] overflow-hidden flex flex-col">
              <div className="px-6 py-5 border-b border-tertiary-fixed bg-surface-container-lowest">
                <h3 className="text-headline-md font-headline-md text-on-surface">
                  Rincian Pesanan
                </h3>
              </div>
              <div className="p-6 flex flex-col space-y-stack-lg flex-grow">
                <div className="flex flex-col space-y-stack-sm">
                  <div className="flex items-center justify-between text-on-surface">
                    <div className="flex flex-col">
                      <span className="text-headline-md font-headline-md">CGK</span>
                      <span className="text-label-sm font-label-sm text-on-surface-variant">
                        Jakarta
                      </span>
                    </div>
                    <div className="flex flex-col items-center flex-grow px-4">
                      <span className="text-label-sm font-label-sm text-on-surface-variant mb-1">
                        1j 50m
                      </span>
                      <div className="w-full h-px bg-outline-variant relative flex justify-center items-center">
                        <span className="material-symbols-outlined text-primary bg-surface absolute px-1 text-[16px]">
                          flight_takeoff
                        </span>
                      </div>
                      <span className="text-label-sm font-label-sm text-on-surface-variant mt-1">
                        Langsung
                      </span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-headline-md font-headline-md">DPS</span>
                      <span className="text-label-sm font-label-sm text-on-surface-variant">
                        Bali
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-2 pt-4 border-t border-tertiary-fixed border-dashed">
                    <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                      calendar_month
                    </span>
                    <span className="text-body-sm font-body-sm text-on-surface-variant">
                      Kam, 24 Okt 2024 • 10:00 - 12:50
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                      airlines
                    </span>
                    <span className="text-body-sm font-body-sm text-on-surface-variant">
                      Garuda Indonesia • Ekonomi
                    </span>
                  </div>
                </div>
                <div className="flex flex-col space-y-3">
                  <div className="flex justify-between items-center text-body-md font-body-md text-on-surface">
                    <span>Tiket Dewasa (x1)</span>
                    <span>Rp 1.500.000</span>
                  </div>
                  <div className="flex justify-between items-center text-body-md font-body-md text-on-surface">
                    <span>Pajak & Biaya</span>
                    <span>Rp 150.000</span>
                  </div>
                </div>
              </div>
              <div className="bg-surface-container px-6 py-5 border-t border-tertiary-fixed mt-auto">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-body-md font-body-md text-on-surface-variant">
                    Total Pembayaran
                  </span>
                  <span className="text-headline-md font-headline-md text-primary">
                    Rp 1.650.000
                  </span>
                </div>
                <Link
                  href={`/book/${flightId}/seat`}
                  className="w-full h-12 bg-primary text-on-primary rounded-lg flex items-center justify-center font-label-md text-label-md hover:opacity-90 transition-opacity"
                >
                  Lanjut Pilih Kursi
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="bg-surface-container-lowest border-t border-outline-variant w-full py-stack-lg mt-auto">
        <div className="w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center space-y-stack-md md:space-y-0">
          <span className="text-headline-sm font-headline-sm font-bold text-on-surface">
            TiketIn
          </span>
          <nav className="flex flex-wrap justify-center gap-x-gutter gap-y-stack-sm">
            <Link
              className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Tentang Kami
            </Link>
            <Link
              className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Pusat Bantuan
            </Link>
            <Link
              className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Syarat & Ketentuan
            </Link>
            <Link
              className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Kebijakan Privasi
            </Link>
          </nav>
          <span className="text-body-sm font-body-sm text-on-surface-variant">
            © 2024 TiketIn. Solusi Perjalanan Modern.
          </span>
        </div>
      </footer>
    </div>
  );
}
