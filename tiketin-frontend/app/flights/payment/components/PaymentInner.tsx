"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  DuffelOffer,
  getCarrierName,
  getFlightNumber,
  getDepartingAt,
  getFinalArrivingAt,
  getOriginIata,
  getDestinationIata,
  getOriginName,
  getDestinationName,
  getDuration,
  getTotalAmount,
  getTotalCurrency,
  formatTime,
  formatCurrency,
  getAirlineLogoUrl,
  getBaggageInfo,
  getFareBrandName,
  getOfferConditions,
  getSegmentCount,
} from "@/app/lib/duffelHelpers";
import {
  BOOKING_OFFER_KEY,
  BOOKING_PASSENGER_KEY,
  ContactForm,
  PassengerForm,
} from "@/app/flights/booking/components/BookingInner";

// ─── Session storage key for booking ID ───────────────────────────────────────

export const BOOKING_ID_KEY = "tiketin_booking_id";

// ─── Payment Methods ──────────────────────────────────────────────────────────

interface PaymentOption {
  id: string;
  name: string;
  badge: string;
  desc: string;
}

interface PaymentCategory {
  category: string;
  options: PaymentOption[];
}

const PAYMENT_CATEGORIES: PaymentCategory[] = [
  {
    category: "Virtual Account (Cek Otomatis)",
    options: [
      { id: "va_bca", name: "BCA Virtual Account", badge: "BCA", desc: "Aktif 24 jam · Verifikasi instan" },
      { id: "va_mandiri", name: "Mandiri Virtual Account", badge: "Mandiri", desc: "Aktif 24 jam · Verifikasi instan" },
      { id: "va_bri", name: "BRI Virtual Account (BRIVA)", badge: "BRI", desc: "Aktif 24 jam · Verifikasi instan" },
      { id: "va_bni", name: "BNI Virtual Account", badge: "BNI", desc: "Aktif 24 jam · Verifikasi instan" },
      { id: "va_cimb", name: "CIMB Niaga Virtual Account", badge: "CIMB", desc: "Aktif 24 jam · Verifikasi instan" },
    ],
  },
  {
    category: "Transfer Bank Lainnya",
    options: [
      { id: "transfer_other", name: "Transfer dari Bank Manapun", badge: "ATM / Mobile", desc: "Realtime Online / SKN / BI-FAST" },
    ],
  },
];

// ─── Flight Summary Sidebar Card ──────────────────────────────────────────────

function FlightSummarySidebar({
  offer,
  bookingId,
  passenger,
}: {
  offer: DuffelOffer;
  bookingId: string;
  passenger: PassengerForm;
}) {
  const [logoError, setLogoError] = useState(false);
  const logoUrl = getAirlineLogoUrl(offer);
  const carrierName = getCarrierName(offer);
  const flightNumber = getFlightNumber(offer);
  const departingAt = getDepartingAt(offer);
  const arrivingAt = getFinalArrivingAt(offer);
  const originIata = getOriginIata(offer);
  const destIata = getDestinationIata(offer);
  const originName = getOriginName(offer);
  const destName = getDestinationName(offer);
  const duration = getDuration(offer);
  const fareBrand = getFareBrandName(offer);
  const segCount = getSegmentCount(offer);
  const transitLabel = segCount <= 1 ? "Langsung" : `${segCount - 1} Transit`;
  const conditions = getOfferConditions(offer);
  const baggage = getBaggageInfo(offer);

  const changeAllowed = conditions?.change_before_departure?.allowed ?? false;
  const refundAllowed = conditions?.refund_before_departure?.allowed ?? false;

  const paxTitle =
    passenger.gender === "male"
      ? "Mr."
      : passenger.gender === "female"
      ? "Mrs./Ms."
      : "";
  const fullName = `${passenger.firstName} ${
    passenger.noLastName ? "" : passenger.lastName
  }`.trim();

  function formatDateShort(iso: string) {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleDateString("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "";
    }
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-[0px_4px_12px_-2px_rgba(15,23,42,0.06)] space-y-4">
      {/* Header with Booking ID */}
      <div className="px-5 py-3.5 bg-primary/8 border-b border-outline-variant flex items-center justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
            Booking ID
          </div>
          <div className="text-label-md font-label-md font-extrabold text-primary tracking-tight">
            #{bookingId}
          </div>
        </div>
        <span className="inline-flex items-center gap-1 bg-primary text-on-primary rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
          <span className="material-symbols-outlined text-[12px]">schedule</span>
          Menunggu Bayar
        </span>
      </div>

      <div className="px-5 pb-5 space-y-4">
        {/* Route Header */}
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60">
          <span className="text-label-sm font-label-sm font-bold text-on-surface">
            {originIata} → {destIata}
          </span>
          <span className="text-[11px] text-on-surface-variant">
            {formatDateShort(departingAt)}
          </span>
        </div>

        {/* Carrier row */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
            {logoUrl && !logoError ? (
              <Image
                src={logoUrl}
                alt={`${carrierName} logo`}
                width={32}
                height={32}
                className="object-contain w-8 h-8"
                onError={() => setLogoError(true)}
                unoptimized
              />
            ) : (
              <span className="material-symbols-outlined text-primary text-lg">
                airlines
              </span>
            )}
          </div>
          <div>
            <div className="text-label-sm font-label-sm font-bold text-on-surface">
              {carrierName}
            </div>
            <div className="text-[11px] text-on-surface-variant">
              {flightNumber} · {fareBrand ?? "Economy Class"}
            </div>
          </div>
        </div>

        {/* Route timeline */}
        <div className="flex items-center gap-2">
          <div className="text-center shrink-0">
            <div className="text-headline-sm font-headline-sm text-on-surface tabular-nums font-bold">
              {formatTime(departingAt)}
            </div>
            <div className="text-[11px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-md mt-0.5 inline-block font-semibold">
              {originIata}
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center min-w-0 px-2">
            <span className="text-[11px] text-tertiary font-semibold">{duration}</span>
            <div className="w-full flex items-center my-1">
              <div className="h-[2px] bg-outline-variant/50 flex-1 rounded-l-full" />
              <span className="material-symbols-outlined text-outline-variant text-[14px] mx-1 rotate-90">
                flight
              </span>
              <div className="h-[2px] bg-outline-variant/50 flex-1 rounded-r-full" />
            </div>
            <span className="text-[11px] text-primary font-medium">{transitLabel}</span>
          </div>
          <div className="text-center shrink-0">
            <div className="text-headline-sm font-headline-sm text-on-surface tabular-nums font-bold">
              {formatTime(arrivingAt)}
            </div>
            <div className="text-[11px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-md mt-0.5 inline-block font-semibold">
              {destIata}
            </div>
          </div>
        </div>

        {/* Airport names */}
        <div className="flex justify-between text-[11px] text-on-surface-variant -mt-2">
          <span className="truncate max-w-[45%]">{originName}</span>
          <span className="truncate max-w-[45%] text-right">{destName}</span>
        </div>

        {/* Passenger details snippet */}
        <div className="bg-surface-container/60 rounded-xl p-3 border border-outline-variant/50 space-y-1.5">
          <div className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">
            Detail Penumpang
          </div>
          <div className="text-label-sm font-label-sm font-bold text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-primary">
              person
            </span>
            {paxTitle} {fullName}
          </div>
        </div>

        {/* Condition & Baggage badges */}
        <div className="pt-2 border-t border-outline-variant/50 flex flex-wrap gap-1.5">
          {/* Baggage */}
          <span
            className={[
              "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold border",
              baggage.hasChecked
                ? "bg-tertiary/10 text-tertiary border-tertiary/20"
                : "bg-surface-container text-on-surface-variant border-outline-variant/60",
            ].join(" ")}
          >
            <span className="material-symbols-outlined text-[12px]">
              {baggage.hasChecked ? "luggage" : "do_not_luggage"}
            </span>
            {baggage.label}
          </span>

          {/* Reschedule */}
          <span
            className={[
              "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold border",
              changeAllowed
                ? "bg-tertiary/10 text-tertiary border-tertiary/20"
                : "bg-surface-container text-on-surface-variant border-outline-variant/60",
            ].join(" ")}
          >
            <span className="material-symbols-outlined text-[12px]">
              {changeAllowed ? "event_available" : "event_busy"}
            </span>
            {changeAllowed ? "Bisa Reschedule" : "Non-Reschedule"}
          </span>

          {/* Refund */}
          <span
            className={[
              "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold border",
              refundAllowed
                ? "bg-tertiary/10 text-tertiary border-tertiary/20"
                : "bg-surface-container text-on-surface-variant border-outline-variant/60",
            ].join(" ")}
          >
            <span className="material-symbols-outlined text-[12px]">
              {refundAllowed ? "payments" : "money_off"}
            </span>
            {refundAllowed ? "Refundable" : "Non-Refund"}
          </span>
        </div>

        {/* Price total box */}
        <div className="pt-3 border-t border-outline-variant/60 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-on-surface-variant">Total Tagihan</div>
            <div className="text-lg font-bold text-primary">
              {formatCurrency(getTotalAmount(offer), getTotalCurrency(offer))}
            </div>
          </div>
          <span className="text-[10px] text-on-surface-variant bg-surface-container px-2 py-1 rounded">
            Termasuk Pajak
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Simulation Success Modal ─────────────────────────────────────────────────

function SuccessModal({
  isOpen,
  bookingId,
  offer,
}: {
  isOpen: boolean;
  bookingId: string;
  offer: DuffelOffer;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-surface-container-lowest max-w-md w-full rounded-3xl p-6 sm:p-8 text-center shadow-[0px_24px_64px_-8px_rgba(15,23,42,0.45)] space-y-6 animate-in zoom-in-95 duration-250 border border-outline-variant/50">
        {/* Animated Check Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <span className="material-symbols-outlined text-5xl">check_circle</span>
        </div>

        <div className="space-y-2">
          <div className="inline-block bg-primary/10 text-primary text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Simulasi Demo
          </div>
          <h2 className="text-headline-sm font-headline-sm font-bold text-on-surface">
            Booking Berhasil!
          </h2>
          <p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed">
            E-tiket Anda telah diterbitkan dan dikirimkan ke email serta nomor telepon terdaftar.
          </p>
        </div>

        {/* Booking ID box */}
        <div className="bg-surface-container/80 rounded-2xl p-4 border border-outline-variant/60 space-y-1">
          <div className="text-[11px] text-on-surface-variant font-medium">Nomor Pemesanan</div>
          <div className="text-headline-md font-headline-md font-extrabold text-primary tracking-tight">
            #{bookingId}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center justify-center gap-1 mt-1">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            Pembayaran Diterima · Lunas
          </div>
        </div>

        {/* Demo explanation */}
        <div className="text-[11px] text-on-surface-variant bg-surface-container-low p-3 rounded-xl border border-outline-variant/40">
          * Note: Ini adalah antarmuka simulasi BUKAN payment gateway nyata (tanpa transaksi finansial asli) untuk presentasi end-to-end TiketIn.
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/"
            className="flex-1 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface font-label-md text-label-md font-semibold hover:border-primary hover:bg-primary/5 hover:text-primary transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            Ke Beranda
          </Link>
          <Link
            href="/flights/search"
            className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-surface-tint active:scale-95 transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            Cari Lainnya
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main PaymentInner Component ──────────────────────────────────────────────

export default function PaymentInner() {
  const router = useRouter();
  const [offer, setOffer] = useState<DuffelOffer | null>(null);
  const [contact, setContact] = useState<ContactForm | null>(null);
  const [passenger, setPassenger] = useState<PassengerForm | null>(null);
  const [bookingId, setBookingId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Selected payment option (default: va_bca)
  const [selectedMethod, setSelectedMethod] = useState<string>("va_bca");
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  // 45 minutes countdown in seconds (45 * 60 = 2700)
  const [timeLeft, setTimeLeft] = useState<number>(2700);

  // ── Read session data on mount ──
  useEffect(() => {
    try {
      const rawOffer = sessionStorage.getItem(BOOKING_OFFER_KEY);
      const rawPax = sessionStorage.getItem(BOOKING_PASSENGER_KEY);

      if (!rawOffer || !rawPax) {
        router.replace(
          "/flights/search?notice=Silakan+lengkapi+data+pemesanan+terlebih+dahulu."
        );
        return;
      }

      const parsedOffer = JSON.parse(rawOffer) as DuffelOffer;
      const parsedPax = JSON.parse(rawPax) as {
        contact: ContactForm;
        passenger: PassengerForm;
      };

      if (!parsedOffer?.id || !parsedPax?.contact || !parsedPax?.passenger) {
        throw new Error("invalid session data");
      }

      setOffer(parsedOffer);
      setContact(parsedPax.contact);
      setPassenger(parsedPax.passenger);

      // Get or generate persistent Booking ID
      let existingId = sessionStorage.getItem(BOOKING_ID_KEY);
      if (!existingId) {
        const randomDigits = Math.floor(100000 + Math.random() * 900000);
        existingId = `TKI${randomDigits}`;
        sessionStorage.setItem(BOOKING_ID_KEY, existingId);
      }
      setBookingId(existingId);
    } catch {
      router.replace(
        "/flights/search?notice=Sesi+pembayaran+tidak+valid.+Silakan+ulangi+pencarian."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  // ── Countdown timer effect ──
  useEffect(() => {
    if (loading || isSuccessOpen) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, isSuccessOpen]);

  // Format MM:SS
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeStr = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-outline-variant border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!offer || !contact || !passenger) return null;

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-sans antialiased">
      {/* ── Navbar ── */}
      <nav className="bg-surface sticky top-0 z-40 border-b border-outline-variant shadow-sm">
        <div className="flex justify-between items-center w-full px-4 md:px-margin-desktop max-w-container-max mx-auto h-16">
          <Link
            href="/"
            className="text-headline-md font-headline-md font-bold text-primary tracking-tight"
          >
            TiketIn
          </Link>
          <div className="flex items-center gap-2 text-label-sm font-label-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px] text-tertiary">
              lock
            </span>
            <span className="hidden sm:inline">Pembayaran Aman 256-bit SSL</span>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-container-max w-full mx-auto px-4 md:px-margin-desktop py-6 pb-28 lg:pb-10 space-y-6">
        {/* ── Top Countdown Banner ── */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">timer</span>
            </div>
            <div>
              <div className="text-label-md font-label-md font-bold text-on-surface">
                Kami menahan harga ini untuk Anda!
              </div>
              <div className="text-[12px] text-on-surface-variant">
                Selesaikan pembayaran sebelum batas waktu berakhir untuk menghindari perubahan tarif.
              </div>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-amber-500/30 px-4 py-2 rounded-xl flex items-center gap-2 shrink-0 self-end sm:self-center shadow-xs">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
              Sisa Waktu:
            </span>
            <span className="text-headline-sm font-headline-sm font-extrabold text-amber-600 tabular-nums">
              {timeStr}
            </span>
          </div>
        </div>

        {/* Page title */}
        <div>
          <h1 className="text-headline-md font-headline-md font-bold text-on-surface">
            Pembayaran
          </h1>
          <p className="text-body-sm font-body-sm text-on-surface-variant mt-0.5">
            Pilih metode pembayaran yang paling nyaman untuk Anda.
          </p>
        </div>

        {/* ── Two-Column Layout ── */}
        <div className="flex gap-6 items-start flex-col lg:flex-row">
          {/* ── Left Column: Payment Methods ── */}
          <div className="flex-1 min-w-0 w-full space-y-6">
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-[0px_4px_12px_-2px_rgba(15,23,42,0.03)]">
              <div className="px-5 py-4 border-b border-outline-variant bg-surface-container-low/60 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    account_balance_wallet
                  </span>
                </div>
                <h2 className="text-label-md font-label-md font-bold text-on-surface">
                  Bagaimana Anda ingin membayar?
                </h2>
              </div>

              <div className="p-5 space-y-6">
                {PAYMENT_CATEGORIES.map((cat) => (
                  <div key={cat.category} className="space-y-3">
                    <div className="text-label-sm font-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
                      {cat.category}
                    </div>

                    <div className="grid gap-3">
                      {cat.options.map((opt) => {
                        const active = selectedMethod === opt.id;
                        return (
                          <label
                            key={opt.id}
                            onClick={() => setSelectedMethod(opt.id)}
                            className={[
                              "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 select-none",
                              active
                                ? "bg-primary/6 border-primary shadow-[0px_0px_0px_2px_rgba(0,101,145,0.18)]"
                                : "bg-surface-container-lowest border-outline-variant hover:border-primary/40 hover:bg-primary/3",
                            ].join(" ")}
                          >
                            <div className="flex items-center gap-3.5">
                              {/* Custom Radio Button */}
                              <div
                                className={[
                                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                                  active ? "border-primary bg-primary" : "border-outline",
                                ].join(" ")}
                              >
                                {active && (
                                  <div className="w-2 h-2 rounded-full bg-on-primary" />
                                )}
                              </div>

                              <div>
                                <div className="text-label-md font-label-md font-bold text-on-surface">
                                  {opt.name}
                                </div>
                                <div className="text-[11px] text-on-surface-variant mt-0.5">
                                  {opt.desc}
                                </div>
                              </div>
                            </div>

                            {/* Bank Text Badge (No Trademark Logos) */}
                            <span
                              className={[
                                "text-[11px] font-extrabold px-2.5 py-1 rounded-md border tracking-wider",
                                active
                                  ? "bg-primary text-on-primary border-primary"
                                  : "bg-surface-container text-on-surface-variant border-outline-variant/60",
                              ].join(" ")}
                            >
                              {opt.badge}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Pay Button Inside Card */}
              <div className="p-5 border-t border-outline-variant bg-surface-container-low/30 hidden lg:block">
                <button
                  type="button"
                  onClick={() => setIsSuccessOpen(true)}
                  className="w-full py-4 rounded-xl bg-primary text-on-primary hover:bg-surface-tint active:scale-[0.99] font-label-md text-label-md font-bold transition-all duration-200 shadow-[0px_6px_16px_-4px_rgba(0,101,145,0.40)] flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    verified_user
                  </span>
                  Bayar Sekarang · {formatCurrency(getTotalAmount(offer), getTotalCurrency(offer))}
                </button>
                <p className="text-[11px] text-on-surface-variant text-center mt-2.5 flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-tertiary">
                    verified
                  </span>
                  Data dan privasi Anda dilindungi dengan enkripsi keamanan tingkat bank.
                </p>
              </div>
            </div>
          </div>

          {/* ── Right Column: Flight Summary Sidebar ── */}
          <aside className="w-full lg:w-80 xl:w-96 shrink-0 lg:sticky lg:top-[88px]">
            <FlightSummarySidebar
              offer={offer}
              bookingId={bookingId}
              passenger={passenger}
            />
          </aside>
        </div>
      </main>

      {/* ── Mobile Sticky Bottom Bar ── */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface-container-lowest border-t border-outline-variant px-4 py-3 shadow-[0px_-4px_16px_-2px_rgba(15,23,42,0.12)]">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider">
              Total Tagihan
            </div>
            <div className="text-label-md font-label-md font-extrabold text-primary">
              {formatCurrency(getTotalAmount(offer), getTotalCurrency(offer))}
            </div>
          </div>
          <span className="text-[11px] font-bold text-on-surface bg-surface-container px-2.5 py-1 rounded-md">
            #{bookingId}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsSuccessOpen(true)}
          className="w-full py-3.5 rounded-xl bg-primary text-on-primary hover:bg-surface-tint active:scale-[0.98] font-label-md text-label-md font-bold transition-all shadow-[0px_4px_12px_-2px_rgba(0,101,145,0.40)] flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">
            verified_user
          </span>
          Bayar Sekarang
        </button>
      </div>

      {/* ── Footer ── */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant mt-auto w-full py-stack-lg px-4 md:px-margin-desktop max-w-container-max mx-auto hidden lg:flex justify-between items-center text-body-sm font-body-sm text-on-surface-variant">
        <div className="font-bold text-on-surface text-headline-sm font-headline-sm">
          TiketIn
        </div>
        <div>© 2024 TiketIn. Solusi Perjalanan Modern · Presentasi Demo Produk.</div>
      </footer>

      {/* ── Simulation Success Modal ── */}
      <SuccessModal
        isOpen={isSuccessOpen}
        bookingId={bookingId}
        offer={offer}
      />
    </div>
  );
}
