"use client";

import { use, useState } from "react";
import Link from "next/link";

type SeatPageProps = {
  params: Promise<{ flightId: string }>;
};

export default function SeatPage({ params }: SeatPageProps) {
  const { flightId } = use(params);
  const [selectedSeat, setSelectedSeat] = useState("12A");

  const handleSeatChange = (seatId: string) => {
    setSelectedSeat(seatId);
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md">
      <header className="bg-surface border-b border-outline-variant docked full-width top-0 z-50">
        <div className="flex justify-between items-center w-full px-margin-desktop max-w-container-max mx-auto h-16">
          <div className="flex items-center gap-gutter">
            <Link
              className="text-headline-md font-headline-md font-bold text-primary"
              href="/"
            >
              TiketIn
            </Link>
            <div className="hidden md:flex items-center gap-4 text-on-surface-variant">
              <span className="material-symbols-outlined" data-icon="search">
                search
              </span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-gutter">
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors duration-200 text-label-md font-label-md"
              href="/search"
            >
              Cari Tiket
            </Link>
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors duration-200 text-label-md font-label-md"
              href="#"
            >
              Promo
            </Link>
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors duration-200 text-label-md font-label-md"
              href="#"
            >
              Bantuan
            </Link>
          </nav>
          <div className="flex items-center gap-stack-sm">
            <button
              type="button"
              className="px-4 py-2 text-primary hover:bg-surface-container rounded transition-colors text-label-md font-label-md"
            >
              Login
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-primary text-on-primary rounded hover:opacity-90 transition-opacity text-label-md font-label-md"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col md:flex-row max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg gap-gutter">
        <div className="flex-1 flex flex-col gap-stack-lg">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-[0px_10px_15px_-3px_rgba(15,23,42,0.05)]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-headline-lg font-headline-lg text-on-surface mb-1">
                  Jakarta (CGK){" "}
                  <span
                    className="material-symbols-outlined align-middle mx-2 text-outline"
                    data-icon="flight_takeoff"
                  >
                    flight_takeoff
                  </span>{" "}
                  Bali (DPS)
                </h1>
                <p className="text-body-lg font-body-lg text-on-surface-variant">
                  Garuda Indonesia • GA-412 • Economy
                </p>
              </div>
              <div className="bg-surface-container px-4 py-2 rounded-full">
                <span className="text-label-md font-label-md text-primary">
                  Pilih Kursi Anda
                </span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-[0px_10px_15px_-3px_rgba(15,23,42,0.05)] flex flex-col items-center">
            <div className="flex gap-6 mb-8 w-full justify-center border-b border-outline-variant pb-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 border border-outline-variant rounded bg-white" />
                <span className="text-body-sm font-body-sm text-on-surface-variant">
                  Tersedia
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 border border-primary-container rounded bg-primary-container flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-[16px] text-white"
                    data-icon="check"
                  >
                    check
                  </span>
                </div>
                <span className="text-body-sm font-body-sm text-on-surface-variant">
                  Dipilih
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 border border-tertiary-fixed rounded bg-tertiary-fixed flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-[16px] text-tertiary"
                    data-icon="close"
                  >
                    close
                  </span>
                </div>
                <span className="text-body-sm font-body-sm text-on-surface-variant">
                  Terisi
                </span>
              </div>
            </div>

            <div className="relative bg-surface p-8 rounded-[4rem] border-2 border-outline-variant max-w-md w-full">
              <div className="flex justify-between mb-4 px-2">
                <div className="flex gap-2 w-24 justify-between">
                  <span className="text-label-sm font-label-sm text-on-surface-variant w-8 text-center">
                    A
                  </span>
                  <span className="text-label-sm font-label-sm text-on-surface-variant w-8 text-center">
                    B
                  </span>
                  <span className="text-label-sm font-label-sm text-on-surface-variant w-8 text-center">
                    C
                  </span>
                </div>
                <div className="w-12 text-center text-label-sm font-label-sm text-outline">
                  Lorong
                </div>
                <div className="flex gap-2 w-24 justify-between">
                  <span className="text-label-sm font-label-sm text-on-surface-variant w-8 text-center">
                    D
                  </span>
                  <span className="text-label-sm font-label-sm text-on-surface-variant w-8 text-center">
                    E
                  </span>
                  <span className="text-label-sm font-label-sm text-on-surface-variant w-8 text-center">
                    F
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {/* Row 10 */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <div className="relative w-8 h-8">
                      <input
                        className="seat-input sr-only"
                        disabled
                        id="seat-10A"
                        type="checkbox"
                      />
                      <label
                        className="absolute inset-0 border border-tertiary-fixed rounded bg-tertiary-fixed flex items-center justify-center cursor-not-allowed"
                        htmlFor="seat-10A"
                      >
                        <span className="material-symbols-outlined text-[16px] text-tertiary">
                          close
                        </span>
                      </label>
                    </div>
                    <div className="relative w-8 h-8">
                      <input
                        className="seat-input sr-only"
                        disabled
                        id="seat-10B"
                        type="checkbox"
                      />
                      <label
                        className="absolute inset-0 border border-tertiary-fixed rounded bg-tertiary-fixed flex items-center justify-center cursor-not-allowed"
                        htmlFor="seat-10B"
                      >
                        <span className="material-symbols-outlined text-[16px] text-tertiary">
                          close
                        </span>
                      </label>
                    </div>
                    <div className="relative w-8 h-8">
                      <input
                        checked={selectedSeat === "10C"}
                        className="seat-input sr-only"
                        id="seat-10C"
                        onChange={() => handleSeatChange("10C")}
                        type="checkbox"
                      />
                      <label
                        className="absolute inset-0 border border-outline-variant rounded bg-white hover:border-primary cursor-pointer transition-colors"
                        htmlFor="seat-10C"
                      />
                    </div>
                  </div>
                  <span className="w-8 text-center text-label-md font-label-md text-outline">
                    10
                  </span>
                  <div className="flex gap-2">
                    <div className="relative w-8 h-8">
                      <input
                        checked={selectedSeat === "10D"}
                        className="seat-input sr-only"
                        id="seat-10D"
                        onChange={() => handleSeatChange("10D")}
                        type="checkbox"
                      />
                      <label
                        className="absolute inset-0 border border-outline-variant rounded bg-white hover:border-primary cursor-pointer transition-colors"
                        htmlFor="seat-10D"
                      />
                    </div>
                    <div className="relative w-8 h-8">
                      <input
                        checked={selectedSeat === "10E"}
                        className="seat-input sr-only"
                        id="seat-10E"
                        onChange={() => handleSeatChange("10E")}
                        type="checkbox"
                      />
                      <label
                        className="absolute inset-0 border border-outline-variant rounded bg-white hover:border-primary cursor-pointer transition-colors"
                        htmlFor="seat-10E"
                      />
                    </div>
                    <div className="relative w-8 h-8">
                      <input
                        checked={selectedSeat === "10F"}
                        className="seat-input sr-only"
                        id="seat-10F"
                        onChange={() => handleSeatChange("10F")}
                        type="checkbox"
                      />
                      <label
                        className="absolute inset-0 border border-outline-variant rounded bg-white hover:border-primary cursor-pointer transition-colors"
                        htmlFor="seat-10F"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 11 */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <div className="relative w-8 h-8">
                      <input
                        checked={selectedSeat === "11A"}
                        className="seat-input sr-only"
                        id="seat-11A"
                        onChange={() => handleSeatChange("11A")}
                        type="checkbox"
                      />
                      <label
                        className="absolute inset-0 border border-outline-variant rounded bg-white hover:border-primary cursor-pointer transition-colors"
                        htmlFor="seat-11A"
                      />
                    </div>
                    <div className="relative w-8 h-8">
                      <input
                        checked={selectedSeat === "11B"}
                        className="seat-input sr-only"
                        id="seat-11B"
                        onChange={() => handleSeatChange("11B")}
                        type="checkbox"
                      />
                      <label
                        className="absolute inset-0 border border-outline-variant rounded bg-white hover:border-primary cursor-pointer transition-colors"
                        htmlFor="seat-11B"
                      />
                    </div>
                    <div className="relative w-8 h-8">
                      <input
                        checked={selectedSeat === "11C"}
                        className="seat-input sr-only"
                        id="seat-11C"
                        onChange={() => handleSeatChange("11C")}
                        type="checkbox"
                      />
                      <label
                        className="absolute inset-0 border border-outline-variant rounded bg-white hover:border-primary cursor-pointer transition-colors"
                        htmlFor="seat-11C"
                      />
                    </div>
                  </div>
                  <span className="w-8 text-center text-label-md font-label-md text-outline">
                    11
                  </span>
                  <div className="flex gap-2">
                    <div className="relative w-8 h-8">
                      <input
                        className="seat-input sr-only"
                        disabled
                        id="seat-11D"
                        type="checkbox"
                      />
                      <label
                        className="absolute inset-0 border border-tertiary-fixed rounded bg-tertiary-fixed flex items-center justify-center cursor-not-allowed"
                        htmlFor="seat-11D"
                      >
                        <span className="material-symbols-outlined text-[16px] text-tertiary">
                          close
                        </span>
                      </label>
                    </div>
                    <div className="relative w-8 h-8">
                      <input
                        className="seat-input sr-only"
                        disabled
                        id="seat-11E"
                        type="checkbox"
                      />
                      <label
                        className="absolute inset-0 border border-tertiary-fixed rounded bg-tertiary-fixed flex items-center justify-center cursor-not-allowed"
                        htmlFor="seat-11E"
                      >
                        <span className="material-symbols-outlined text-[16px] text-tertiary">
                          close
                        </span>
                      </label>
                    </div>
                    <div className="relative w-8 h-8">
                      <input
                        checked={selectedSeat === "11F"}
                        className="seat-input sr-only"
                        id="seat-11F"
                        onChange={() => handleSeatChange("11F")}
                        type="checkbox"
                      />
                      <label
                        className="absolute inset-0 border border-outline-variant rounded bg-white hover:border-primary cursor-pointer transition-colors"
                        htmlFor="seat-11F"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 12 (Selected) */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <div className="relative w-8 h-8">
                      <input
                        checked={selectedSeat === "12A"}
                        className="seat-input sr-only"
                        id="seat-12A"
                        onChange={() => handleSeatChange("12A")}
                        type="checkbox"
                      />
                      <label
                        className="absolute inset-0 border border-primary-container rounded flex items-center justify-center cursor-pointer transition-colors"
                        htmlFor="seat-12A"
                        style={
                          selectedSeat === "12A"
                            ? {
                                backgroundColor: "#0ea5e9",
                                borderColor: "#0ea5e9",
                              }
                            : undefined
                        }
                      >
                        {selectedSeat === "12A" && (
                          <span className="material-symbols-outlined text-[16px] text-white">
                            check
                          </span>
                        )}
                      </label>
                    </div>
                    <div className="relative w-8 h-8">
                      <input
                        checked={selectedSeat === "12B"}
                        className="seat-input sr-only"
                        id="seat-12B"
                        onChange={() => handleSeatChange("12B")}
                        type="checkbox"
                      />
                      <label
                        className="absolute inset-0 border border-outline-variant rounded bg-white hover:border-primary cursor-pointer transition-colors"
                        htmlFor="seat-12B"
                      />
                    </div>
                    <div className="relative w-8 h-8">
                      <input
                        checked={selectedSeat === "12C"}
                        className="seat-input sr-only"
                        id="seat-12C"
                        onChange={() => handleSeatChange("12C")}
                        type="checkbox"
                      />
                      <label
                        className="absolute inset-0 border border-outline-variant rounded bg-white hover:border-primary cursor-pointer transition-colors"
                        htmlFor="seat-12C"
                      />
                    </div>
                  </div>
                  <span className="w-8 text-center text-label-md font-label-md text-outline">
                    12
                  </span>
                  <div className="flex gap-2">
                    <div className="relative w-8 h-8">
                      <input
                        checked={selectedSeat === "12D"}
                        className="seat-input sr-only"
                        id="seat-12D"
                        onChange={() => handleSeatChange("12D")}
                        type="checkbox"
                      />
                      <label
                        className="absolute inset-0 border border-outline-variant rounded bg-white hover:border-primary cursor-pointer transition-colors"
                        htmlFor="seat-12D"
                      />
                    </div>
                    <div className="relative w-8 h-8">
                      <input
                        checked={selectedSeat === "12E"}
                        className="seat-input sr-only"
                        id="seat-12E"
                        onChange={() => handleSeatChange("12E")}
                        type="checkbox"
                      />
                      <label
                        className="absolute inset-0 border border-outline-variant rounded bg-white hover:border-primary cursor-pointer transition-colors"
                        htmlFor="seat-12E"
                      />
                    </div>
                    <div className="relative w-8 h-8">
                      <input
                        checked={selectedSeat === "12F"}
                        className="seat-input sr-only"
                        id="seat-12F"
                        onChange={() => handleSeatChange("12F")}
                        type="checkbox"
                      />
                      <label
                        className="absolute inset-0 border border-outline-variant rounded bg-white hover:border-primary cursor-pointer transition-colors"
                        htmlFor="seat-12F"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="w-full md:w-80 flex flex-col gap-stack-md">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-[0px_10px_15px_-3px_rgba(15,23,42,0.05)] sticky top-24">
            <h2 className="text-headline-md font-headline-md text-on-surface border-b border-outline-variant pb-4 mb-4">
              Ringkasan
            </h2>
            <div className="flex justify-between items-center mb-6">
              <span className="text-body-md font-body-md text-on-surface-variant">
                Penumpang 1
              </span>
              <div className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-label-sm font-label-sm font-bold">
                Kursi {selectedSeat}
              </div>
            </div>
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-outline-variant">
              <span className="text-body-md font-body-md text-on-surface-variant">
                Total Biaya Kursi
              </span>
              <span className="text-headline-md font-headline-md text-on-surface">
                Rp 0
              </span>
            </div>
            <Link
              href={`/payment/${flightId}`}
              className="w-full h-12 bg-primary text-on-primary rounded-lg text-label-md font-label-md hover:opacity-90 transition-opacity flex justify-center items-center gap-2"
            >
              Simpan & Lanjut Pembayaran
              <span className="material-symbols-outlined" data-icon="arrow_forward">
                arrow_forward
              </span>
            </Link>
          </div>
        </aside>
      </main>

      <footer className="bg-surface-container-lowest border-t border-outline-variant mt-auto">
        <div className="w-full py-stack-lg px-margin-desktop max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-headline-sm font-headline-sm font-bold text-on-surface">
            TiketIn
          </div>
          <nav className="flex flex-wrap justify-center gap-4">
            <Link
              className="text-on-surface-variant hover:underline hover:text-primary text-body-sm font-body-sm transition-colors"
              href="#"
            >
              Tentang Kami
            </Link>
            <Link
              className="text-on-surface-variant hover:underline hover:text-primary text-body-sm font-body-sm transition-colors"
              href="#"
            >
              Pusat Bantuan
            </Link>
            <Link
              className="text-on-surface-variant hover:underline hover:text-primary text-body-sm font-body-sm transition-colors"
              href="#"
            >
              Syarat & Ketentuan
            </Link>
            <Link
              className="text-on-surface-variant hover:underline hover:text-primary text-body-sm font-body-sm transition-colors"
              href="#"
            >
              Kebijakan Privasi
            </Link>
          </nav>
          <div className="text-body-sm font-body-sm text-on-surface-variant">
            © 2024 TiketIn. Solusi Perjalanan Modern.
          </div>
        </div>
      </footer>
    </div>
  );
}
