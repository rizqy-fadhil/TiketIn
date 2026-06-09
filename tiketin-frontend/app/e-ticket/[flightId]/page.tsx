import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "E-Ticket Dashboard - TiketIn",
};

const AIRLINE_LOGO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBHwSRqocf3E0_O6JnKYwU22hIJeaGMaTY3XWixyv5HUYwxUGnenRq3aN-BpDDjBS0H9viOInwsD79LLANnbaqx6MatSMAthTiasnCXuxBB4wxZ8QTWATJPJg_ipt7UbpJf00YVyKfAKRQY-vdHD6NglObTi7J-aZS3IAz0kYu4kt5imdZ3NRLsGgU7MwbtNl-TKgigy-UFEC33DW1Sv9p71NyFUZ45o1ECHiVRnlULbgFQWj8WaoCwt2XiAqn9u-LA19PWR-G6Xkw";

const QR_CODE_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB8w_jLb3s09_CdMGi4rDiX8t83UK4n2LR_5CgXFlBgLYk-3EEJFOAJPRsDKRXu7GhHylgwgaEBIT1TLdhZGjUMHL4s5qf5vd9EgukJaKhcZo5f5LHfwudDudpFOduDujuAt73PpeDcgY9wwBoCNbOQ2mvU8HM77wdS0MaeFg1l7K_qRHYljOU1786nQCoGcM1LISuIFJzMmDbu0Cz3t5Hwg3SJPVvh56YzJZZn8GhrnH34AO5ET247C7aDzR69sN09lGSnDCXcGGg";

type ETicketPageProps = {
  params: Promise<{ flightId: string }>;
};

export default async function ETicketPage({ params }: ETicketPageProps) {
  const { flightId } = await params;

  return (
    <div className="bg-background text-on-background font-body-md text-body-md antialiased min-h-screen flex flex-col">
      <nav className="bg-surface border-b border-outline-variant w-full top-0 z-50">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined material-symbols-fill text-primary text-[28px]">
              flight_takeoff
            </span>
            <span className="text-headline-md font-headline-md font-bold text-primary">
              TiketIn
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-gutter">
            <Link
              className="text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors duration-200"
              href="/search"
            >
              Cari Tiket
            </Link>
            <Link
              className="text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors duration-200"
              href="#"
            >
              Promo
            </Link>
            <Link
              className="text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors duration-200"
              href="#"
            >
              Bantuan
            </Link>
          </div>
          <div className="flex items-center gap-stack-sm md:gap-stack-md">
            <button
              type="button"
              className="text-primary font-label-md text-label-md hover:text-primary-container transition-colors duration-200 px-4 py-2"
            >
              Login
            </button>
            <button
              type="button"
              className="bg-primary text-on-primary font-label-md text-label-md rounded px-6 py-2.5 hover:bg-primary-container transition-colors duration-200 hidden md:block"
            >
              Register
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow w-full px-margin-mobile md:px-margin-desktop max-w-[1000px] mx-auto py-stack-lg">
        <div className="mb-stack-lg">
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-surface mb-stack-sm">
            E-Ticket Dashboard
          </h1>
          <p className="text-body-md font-body-md text-on-surface-variant">
            Here is your digital boarding pass. Have a safe flight.
          </p>
          <p className="sr-only">Flight ID: {flightId}</p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl shadow-[0px_10px_15px_-3px_rgba(15,23,42,0.05)] border border-outline-variant/40 flex flex-col md:flex-row relative overflow-visible mb-stack-lg">
          <div className="p-stack-lg md:p-[2.5rem] flex-grow relative">
            <div className="flex justify-between items-start mb-stack-lg">
              <Image
                alt="Airline Logo"
                src={AIRLINE_LOGO}
                width={120}
                height={48}
                className="h-12 w-auto object-contain mix-blend-multiply"
              />
              <div className="text-right">
                <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
                  Booking Code / PNR
                </p>
                <p className="text-headline-md font-headline-md text-primary font-bold tracking-widest">
                  AB123C
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between py-stack-md border-y border-outline-variant/30 mb-stack-lg">
              <div className="text-center w-1/3">
                <p className="text-display-lg font-display-lg text-on-surface leading-none mb-1">
                  SUB
                </p>
                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  Surabaya
                </p>
              </div>
              <div className="w-1/3 flex flex-col items-center justify-center relative">
                <p className="text-label-sm font-label-sm text-primary mb-2 bg-surface-container-low px-3 py-1 rounded-full">
                  Flight GA-302
                </p>
                <div className="w-full flex items-center relative">
                  <div className="w-2 h-2 rounded-full border-2 border-outline-variant" />
                  <div className="flex-grow border-t-2 border-dashed border-outline-variant mx-1" />
                  <span className="material-symbols-outlined text-primary text-[24px] absolute left-1/2 -translate-x-1/2 bg-surface-container-lowest px-1">
                    flight
                  </span>
                  <div className="w-2 h-2 rounded-full border-2 border-primary bg-primary" />
                </div>
                <p className="text-label-sm font-label-sm text-on-surface-variant mt-2">
                  1h 45m
                </p>
              </div>
              <div className="text-center w-1/3">
                <p className="text-display-lg font-display-lg text-on-surface leading-none mb-1">
                  JKT
                </p>
                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  Jakarta
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-stack-md">
              <div>
                <p className="text-label-sm font-label-sm text-on-surface-variant uppercase mb-1">
                  Passenger
                </p>
                <p className="text-body-md font-body-md text-on-surface font-semibold truncate">
                  John Doe
                </p>
              </div>
              <div>
                <p className="text-label-sm font-label-sm text-on-surface-variant uppercase mb-1">
                  Date
                </p>
                <p className="text-body-md font-body-md text-on-surface font-semibold">
                  24 Nov 2024
                </p>
              </div>
              <div>
                <p className="text-label-sm font-label-sm text-on-surface-variant uppercase mb-1">
                  Class
                </p>
                <p className="text-body-md font-body-md text-on-surface font-semibold">
                  Economy (Y)
                </p>
              </div>
              <div>
                <p className="text-label-sm font-label-sm text-on-surface-variant uppercase mb-1">
                  Seat
                </p>
                <p className="text-body-md font-body-md text-on-surface font-semibold text-primary">
                  12A
                </p>
              </div>
            </div>

            <div className="hidden md:block ticket-cutout-top" />
            <div className="hidden md:block ticket-cutout-bottom" />
          </div>

          <div className="hidden md:block border-l-2 border-dashed border-outline-variant/40 relative" />
          <div className="md:hidden border-t-2 border-dashed border-outline-variant/40 relative mx-stack-lg">
            <div className="ticket-cutout-top" />
            <div className="ticket-cutout-bottom" />
          </div>

          <div className="p-stack-lg md:p-[2.5rem] md:w-[320px] bg-surface-bright/50 flex flex-col items-center justify-center">
            <div className="w-full flex justify-between items-center mb-stack-md md:hidden">
              <p className="text-headline-md font-headline-md text-primary font-bold">
                AB123C
              </p>
              <p className="text-body-sm font-body-sm text-on-surface-variant">
                Seat <strong className="text-on-surface">12A</strong>
              </p>
            </div>
            <div className="w-full grid grid-cols-2 gap-stack-sm text-center mb-stack-lg bg-surface-container-low rounded-lg p-stack-sm">
              <div>
                <p className="text-label-sm font-label-sm text-on-surface-variant uppercase">
                  Boarding Time
                </p>
                <p className="text-headline-md font-headline-md text-on-surface text-error">
                  08:15
                </p>
              </div>
              <div className="border-l border-outline-variant/30">
                <p className="text-label-sm font-label-sm text-on-surface-variant uppercase">
                  Gate
                </p>
                <p className="text-headline-md font-headline-md text-on-surface">
                  G4
                </p>
              </div>
            </div>
            <div className="bg-white p-2 rounded-lg shadow-sm border border-outline-variant/20 mb-stack-sm">
              <Image
                alt="QR Code"
                src={QR_CODE_IMAGE}
                width={120}
                height={120}
                className="w-[120px] h-[120px] object-cover rounded-sm mix-blend-multiply filter grayscale contrast-150"
              />
            </div>
            <p className="text-label-sm font-label-sm text-on-surface-variant mt-2 text-center">
              Scan at boarding gate
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-stack-md justify-center mt-stack-lg">
          <button
            type="button"
            className="bg-primary text-on-primary h-[48px] px-8 rounded-DEFAULT font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-primary-container transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
            Download PDF
          </button>
          <button
            type="button"
            className="bg-surface-container text-primary h-[48px] px-8 rounded-DEFAULT font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">mail</span>
            Kirim ke Email
          </button>
        </div>
      </main>

      <footer className="bg-surface-container-lowest border-t border-outline-variant w-full mt-auto">
        <div className="w-full py-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-stack-md">
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined material-symbols-fill text-on-surface text-[24px]">
                flight_takeoff
              </span>
              <span className="text-headline-sm font-headline-sm font-bold text-on-surface">
                TiketIn
              </span>
            </div>
            <p className="text-body-sm font-body-sm text-on-surface-variant">
              © 2024 TiketIn. Solusi Perjalanan Modern.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-gutter gap-y-stack-sm">
            <Link
              className="text-on-surface-variant font-label-sm text-label-sm hover:underline hover:text-primary transition-colors"
              href="#"
            >
              Tentang Kami
            </Link>
            <Link
              className="text-on-surface-variant font-label-sm text-label-sm hover:underline hover:text-primary transition-colors"
              href="#"
            >
              Pusat Bantuan
            </Link>
            <Link
              className="text-on-surface-variant font-label-sm text-label-sm hover:underline hover:text-primary transition-colors"
              href="#"
            >
              Syarat & Ketentuan
            </Link>
            <Link
              className="text-on-surface-variant font-label-sm text-label-sm hover:underline hover:text-primary transition-colors"
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
