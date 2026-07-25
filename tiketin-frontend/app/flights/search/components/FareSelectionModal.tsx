"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import {
  DuffelOffer,
  FlightGroup,
  getCarrierName,
  getFlightNumber,
  getDepartingAt,
  getFinalArrivingAt,
  getArrivingAt,
  getOriginIata,
  getDestinationIata,
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
  getOriginName,
  getDestinationName,
  DuffelConditionPolicy,
} from "@/app/lib/duffelHelpers";
import { BOOKING_OFFER_KEY } from "@/app/flights/booking/components/BookingInner";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(isoString: string): string {
  if (!isoString) return "";
  try {
    return new Date(isoString).toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function policyLabel(policy: DuffelConditionPolicy | null | undefined): {
  allowed: boolean;
  detail: string;
} {
  if (!policy) return { allowed: false, detail: "Tidak tersedia" };
  if (!policy.allowed) return { allowed: false, detail: "Tidak bisa" };

  const amt = parseFloat(policy.penalty_amount ?? "0");
  const cur = policy.penalty_currency ?? "";

  if (amt === 0) return { allowed: true, detail: "Gratis" };
  if (cur && amt > 0) {
    return {
      allowed: true,
      detail: `Biaya ${formatCurrency(amt, cur)}`,
    };
  }
  return { allowed: true, detail: "Berbayar" };
}

// ─── Fare Card ────────────────────────────────────────────────────────────────

interface FareCardProps {
  offer: DuffelOffer;
  isRecommended: boolean;
  onSelect: (offer: DuffelOffer) => void;
}

function FareCard({ offer, isRecommended, onSelect }: FareCardProps) {
  const fareBrand = getFareBrandName(offer) ?? "Economy";
  const conditions = getOfferConditions(offer);
  const baggage = getBaggageInfo(offer);
  const amount = getTotalAmount(offer);
  const currency = getTotalCurrency(offer);

  const changePolicy = policyLabel(conditions?.change_before_departure);
  const refundPolicy = policyLabel(conditions?.refund_before_departure);

  return (
    <div
      className={[
        "relative flex flex-col rounded-2xl border transition-all duration-300 overflow-hidden",
        isRecommended
          ? "border-primary shadow-[0px_0px_0px_2px_rgba(0,101,145,0.20)] bg-primary/4"
          : "border-outline-variant bg-surface-container-lowest hover:border-primary/40 hover:shadow-[0px_4px_16px_-4px_rgba(15,23,42,0.08)]",
      ].join(" ")}
    >
      {/* Recommended badge */}
      {isRecommended && (
        <div className="bg-primary text-on-primary text-[10px] font-bold uppercase tracking-widest text-center py-1.5 px-3">
          Harga Terbaik
        </div>
      )}

      <div className="p-4 flex flex-col flex-1 gap-4">
        {/* Fare name */}
        <div>
          <h3 className="text-label-md font-label-md font-bold text-on-surface">{fareBrand}</h3>
          <p className="text-[11px] text-on-surface-variant mt-0.5">Economy Class</p>
        </div>

        {/* Facilities */}
        <div className="space-y-2.5 flex-1">
          {/* Carry-on baggage */}
          <div className="flex items-start gap-2.5">
            <div
              className={[
                "w-6 h-6 rounded-md flex items-center justify-center shrink-0",
                "bg-surface-container",
              ].join(" ")}
            >
              <span className="material-symbols-outlined text-[14px] text-primary">backpack</span>
            </div>
            <div>
              <div className="text-[12px] font-semibold text-on-surface">Kabin</div>
              <div className="text-[11px] text-on-surface-variant">
                {baggage.hasCarryOn ? "1 tas kabin" : "Tidak termasuk"}
              </div>
            </div>
          </div>

          {/* Checked baggage */}
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 bg-surface-container">
              <span
                className={[
                  "material-symbols-outlined text-[14px]",
                  baggage.hasChecked ? "text-primary" : "text-outline",
                ].join(" ")}
              >
                {baggage.hasChecked ? "luggage" : "do_not_luggage"}
              </span>
            </div>
            <div>
              <div className="text-[12px] font-semibold text-on-surface">Bagasi Koper</div>
              <div className="text-[11px] text-on-surface-variant">
                {baggage.hasChecked ? `${baggage.checkedQuantity} koper (23kg)` : "Tidak termasuk"}
              </div>
            </div>
          </div>

          {/* Reschedule */}
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 bg-surface-container">
              <span
                className={[
                  "material-symbols-outlined text-[14px]",
                  changePolicy.allowed ? "text-tertiary" : "text-outline",
                ].join(" ")}
              >
                {changePolicy.allowed ? "event_available" : "event_busy"}
              </span>
            </div>
            <div>
              <div className="text-[12px] font-semibold text-on-surface">Reschedule</div>
              <div
                className={[
                  "text-[11px]",
                  changePolicy.allowed ? "text-tertiary" : "text-on-surface-variant",
                ].join(" ")}
              >
                {changePolicy.detail}
              </div>
            </div>
          </div>

          {/* Refund */}
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 bg-surface-container">
              <span
                className={[
                  "material-symbols-outlined text-[14px]",
                  refundPolicy.allowed ? "text-tertiary" : "text-outline",
                ].join(" ")}
              >
                {refundPolicy.allowed ? "payments" : "money_off"}
              </span>
            </div>
            <div>
              <div className="text-[12px] font-semibold text-on-surface">Refund</div>
              <div
                className={[
                  "text-[11px]",
                  refundPolicy.allowed ? "text-tertiary" : "text-on-surface-variant",
                ].join(" ")}
              >
                {refundPolicy.detail}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-outline-variant/60" />

        {/* Price + CTA */}
        <div className="flex flex-col gap-2.5">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">
              Harga/orang
            </div>
            <div
              className={[
                "text-lg font-bold tracking-tight",
                isRecommended ? "text-primary" : "text-on-surface",
              ].join(" ")}
            >
              {formatCurrency(amount, currency)}
            </div>
            {currency !== "IDR" && (
              <div className="text-[10px] text-on-surface-variant font-medium">{currency}</div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onSelect(offer)}
            className={[
              "w-full py-2.5 rounded-xl text-label-sm font-label-sm font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5",
              isRecommended
                ? "bg-primary text-on-primary shadow-[0px_4px_8px_-2px_rgba(0,101,145,0.35)] hover:bg-surface-tint"
                : "bg-surface-container border border-outline-variant text-on-surface hover:border-primary hover:bg-primary/8 hover:text-primary",
            ].join(" ")}
          >
            <span className="material-symbols-outlined text-[15px]">check_circle</span>
            Pilih Tiket Ini
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Flight Summary Header ────────────────────────────────────────────────────

function FlightSummaryHeader({ offer }: { offer: DuffelOffer }) {
  const [logoError, setLogoError] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const carrierName = getCarrierName(offer);
  const flightNumber = getFlightNumber(offer);
  const departingAt = getDepartingAt(offer);
  const arrivingAt = getFinalArrivingAt(offer);
  const originIata = getOriginIata(offer);
  const destIata = getDestinationIata(offer);
  const originName = getOriginName(offer);
  const destName = getDestinationName(offer);
  const duration = getDuration(offer);
  const logoUrl = getAirlineLogoUrl(offer);
  const segCount = getSegmentCount(offer);
  const transitLabel = segCount <= 1 ? "Langsung" : `${segCount - 1} Transit`;

  return (
    <div className="bg-surface-container-low rounded-2xl border border-outline-variant p-4">
      {/* Badge + route */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider">
          <span className="material-symbols-outlined text-[11px]">flight_takeoff</span>
          Keberangkatan
        </span>
        <span className="text-label-sm font-label-sm text-on-surface font-semibold">
          {originIata} → {destIata}
        </span>
        <span className="text-body-sm font-body-sm text-on-surface-variant">
          · {formatDate(departingAt)}
        </span>
      </div>

      {/* Main flight row */}
      <div className="flex items-center gap-3">
        {/* Airline logo */}
        <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
          {logoUrl && !logoError ? (
            <Image
              src={logoUrl}
              alt={`${carrierName} logo`}
              width={36}
              height={36}
              className="object-contain w-9 h-9"
              onError={() => setLogoError(true)}
              unoptimized
            />
          ) : (
            <span className="material-symbols-outlined text-primary text-xl">airlines</span>
          )}
        </div>

        {/* Carrier + flight number */}
        <div className="shrink-0">
          <div className="text-label-sm font-label-sm font-semibold text-on-surface">
            {carrierName}
          </div>
          <div className="text-[11px] text-on-surface-variant">{flightNumber}</div>
        </div>

        {/* Timeline */}
        <div className="flex-1 flex items-center gap-2 px-2">
          {/* Departure time + airport */}
          <div className="text-center shrink-0">
            <div className="text-headline-sm font-headline-sm text-on-surface tabular-nums">
              {formatTime(departingAt)}
            </div>
            <div className="text-label-sm font-label-sm text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded-md mt-0.5 inline-block">
              {originIata}
            </div>
          </div>

          {/* Duration bar */}
          <div className="flex-1 flex flex-col items-center min-w-[70px]">
            <span className="text-[11px] text-tertiary font-semibold">{duration}</span>
            <div className="w-full flex items-center my-1">
              <div className="h-[2px] bg-outline-variant/50 flex-1 rounded-l-full" />
              <span className="material-symbols-outlined text-outline-variant text-[16px] mx-1 rotate-90">
                flight
              </span>
              <div className="h-[2px] bg-outline-variant/50 flex-1 rounded-r-full" />
            </div>
            <span className="text-[11px] text-primary font-medium">{transitLabel}</span>
          </div>

          {/* Arrival time + airport */}
          <div className="text-center shrink-0">
            <div className="text-headline-sm font-headline-sm text-on-surface tabular-nums">
              {formatTime(arrivingAt)}
            </div>
            <div className="text-label-sm font-label-sm text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded-md mt-0.5 inline-block">
              {destIata}
            </div>
          </div>
        </div>
      </div>

      {/* Airport names row */}
      <div className="flex justify-between mt-2 px-14 text-[11px] text-on-surface-variant">
        <span>{originName}</span>
        <span className="text-right">{destName}</span>
      </div>

      {/* Flight details accordion (placeholder) */}
      <button
        type="button"
        onClick={() => setDetailOpen((o) => !o)}
        className="mt-3 flex items-center gap-1 text-primary text-[12px] font-semibold hover:underline transition-colors"
      >
        <span className="material-symbols-outlined text-[14px]">info</span>
        Detail Penerbangan
        <span
          className={[
            "material-symbols-outlined text-[14px] transition-transform duration-200",
            detailOpen ? "rotate-180" : "",
          ].join(" ")}
        >
          expand_more
        </span>
      </button>

      {detailOpen && (
        <div className="mt-2 p-3 bg-surface-container rounded-xl border border-outline-variant/50 text-[12px] text-on-surface-variant">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="material-symbols-outlined text-[14px] text-outline">info</span>
            Detail rute lengkap (termasuk informasi transit, fasilitas pesawat, dll.) akan tersedia
            di halaman konfirmasi setelah memilih tiket.
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

interface Props {
  group: FlightGroup | null;
  onClose: () => void;
  /**
   * Called when user confirms a specific fare.
   * The modal handles sessionStorage write + navigation internally.
   * This prop is kept for optional parent-level side effects (e.g. analytics).
   */
  onSelectFare?: (offer: DuffelOffer) => void;
}

export default function FareSelectionModal({ group, onClose, onSelectFare }: Props) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Write selected offer to sessionStorage and navigate to booking page
  const handleSelectFare = useCallback(
    (offer: DuffelOffer) => {
      try {
        sessionStorage.setItem(BOOKING_OFFER_KEY, JSON.stringify(offer));
      } catch {
        // sessionStorage unavailable (private mode quirks) — still navigate
      }
      onSelectFare?.(offer); // optional parent hook (analytics, etc.)
      onClose();
      router.push("/flights/booking");
    },
    [onClose, onSelectFare, router]
  );

  // Close on backdrop click
  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === backdropRef.current) onClose();
  }

  // Close on Escape key
  useEffect(() => {
    if (!group) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [group, onClose]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (group) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [group]);

  if (!group) return null;

  const { representative, fares } = group;

  return (
    /* Backdrop */
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Pilih Tipe Tiket"
    >
      {/* Modal panel */}
      <div className="relative bg-background w-full sm:max-w-3xl max-h-[94dvh] sm:max-h-[88vh] rounded-t-3xl sm:rounded-3xl flex flex-col shadow-[0px_24px_64px_-8px_rgba(15,23,42,0.35)] overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300">
        {/* ── Modal Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant bg-surface-container-lowest shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup modal"
              className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-surface-container transition-colors duration-200 -ml-1"
            >
              <span className="material-symbols-outlined text-on-surface-variant text-[22px]">
                close
              </span>
            </button>
            <div>
              <h2 className="text-label-md font-label-md font-bold text-on-surface">
                Pilih Tipe Tiket
              </h2>
              <p className="text-[11px] text-on-surface-variant">
                {fares.length} pilihan tersedia
              </p>
            </div>
          </div>

          {/* Placeholder actions */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Simpan (segera hadir)"
              title="Simpan (segera hadir)"
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container transition-colors duration-200 text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-[20px]">bookmark</span>
            </button>
            <button
              type="button"
              aria-label="Bagikan (segera hadir)"
              title="Bagikan (segera hadir)"
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container transition-colors duration-200 text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-[20px]">share</span>
            </button>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto flex-1 px-4 sm:px-5 py-4 space-y-5">
          {/* Flight summary */}
          <FlightSummaryHeader offer={representative} />

          {/* Fare count heading */}
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-label-md font-label-md font-semibold text-on-surface">
                Pilih Tarif
              </h3>
              <p className="text-[12px] text-on-surface-variant">
                {fares.length === 1
                  ? "1 tarif tersedia untuk penerbangan ini"
                  : `${fares.length} tarif tersedia — pilih sesuai kebutuhan Anda`}
              </p>
            </div>
            {fares.length > 1 && (
              <span className="inline-flex items-center gap-1 bg-tertiary/10 text-tertiary border border-tertiary/20 rounded-full px-2.5 py-0.5 text-[11px] font-semibold">
                <span className="material-symbols-outlined text-[11px]">compare</span>
                Bandingkan
              </span>
            )}
          </div>

          {/* Fare cards grid */}
          {/*
           * Multi-fare variant UI (Rencana A):
           * Shown when groupOffersByFlight() produces groups with >1 fare.
           * Verified against live Duffel sandbox: 49/59 unique flights have 2-5 fare variants.
           *
           * If in the future this modal is used with data where each offer is unique
           * (no multi-fare groups), fares.length will be 1 and the grid renders a
           * single card — which is the correct "Rencana B" fallback with no code change needed.
           */}
          <div
            className={[
              "grid gap-4",
              fares.length === 1
                ? "grid-cols-1 max-w-sm mx-auto"
                : fares.length === 2
                ? "grid-cols-1 sm:grid-cols-2"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
            ].join(" ")}
          >
            {fares.map((offer, idx) => (
              <FareCard
                key={offer.id ?? idx}
                offer={offer}
                isRecommended={idx === 0}
                onSelect={handleSelectFare}
              />
            ))}
          </div>

          {/* Fine print */}
          <p className="text-[11px] text-on-surface-variant text-center pb-2">
            Harga sudah termasuk pajak dan biaya. Kebijakan reschedule/refund mengikuti ketentuan
            maskapai.
          </p>
        </div>
      </div>
    </div>
  );
}
