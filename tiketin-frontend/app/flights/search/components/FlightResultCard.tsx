"use client";

import Image from "next/image";
import { useState } from "react";
import {
  DuffelOffer,
  getCarrierName,
  getFlightNumber,
  getDepartingAt,
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
} from "@/app/lib/duffelHelpers";

interface Props {
  offer: DuffelOffer;
}

export default function FlightResultCard({ offer }: Props) {
  const carrierName = getCarrierName(offer);
  const flightNumber = getFlightNumber(offer);
  const departingAt = getDepartingAt(offer);
  const arrivingAt = getArrivingAt(offer);
  const originIata = getOriginIata(offer);
  const destinationIata = getDestinationIata(offer);
  const duration = getDuration(offer);
  const amount = getTotalAmount(offer);
  const currency = getTotalCurrency(offer);
  const logoUrl = getAirlineLogoUrl(offer);
  const baggage = getBaggageInfo(offer);

  // Track logo load failure to show fallback icon
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="group bg-surface-container-lowest rounded-xl border border-outline-variant p-gutter shadow-[0px_4px_12px_-2px_rgba(15,23,42,0.03)] hover:shadow-[0px_10px_24px_-4px_rgba(15,23,42,0.10)] hover:border-outline transition-all duration-300 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 relative overflow-hidden">
      {/* Accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-300 rounded-l-xl" />

      {/* Carrier info */}
      <div className="flex items-center gap-3 md:w-[30%] shrink-0 pl-1">
        {/* Airline logo — falls back to generic icon if URL is null or fails to load */}
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 overflow-hidden">
          {logoUrl && !logoError ? (
            <Image
              src={logoUrl}
              alt={`${carrierName} logo`}
              width={40}
              height={40}
              className="object-contain w-10 h-10"
              onError={() => setLogoError(true)}
              // Unoptimized avoids the need to allowlist every possible Duffel subdomain pattern
              unoptimized
            />
          ) : (
            <span className="material-symbols-outlined text-primary text-2xl">
              airlines
            </span>
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <h3 className="text-label-md font-label-md text-on-surface truncate">{carrierName}</h3>
          <p className="text-body-sm font-body-sm text-on-surface-variant">{flightNumber}</p>
          {/* Baggage badge */}
          <div className="flex items-center gap-1 mt-1">
            {baggage.hasChecked ? (
              <span className="inline-flex items-center gap-0.5 bg-tertiary/10 text-tertiary border border-tertiary/20 rounded-md px-1.5 py-0.5 text-[10px] font-semibold leading-none">
                <span className="material-symbols-outlined text-[11px]">luggage</span>
                {baggage.label}
              </span>
            ) : (
              <span className="inline-flex items-center gap-0.5 bg-surface-container text-on-surface-variant border border-outline-variant/60 rounded-md px-1.5 py-0.5 text-[10px] font-semibold leading-none">
                <span className="material-symbols-outlined text-[11px]">do_not_luggage</span>
                {baggage.label}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Flight route timeline */}
      <div className="flex items-center justify-between flex-1 md:w-[40%] px-2">
        {/* Departure */}
        <div className="text-center shrink-0">
          <div className="text-headline-md font-headline-md text-on-surface tabular-nums">
            {formatTime(departingAt)}
          </div>
          <div className="text-label-sm font-label-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-md mt-1 inline-block">
            {originIata}
          </div>
        </div>

        {/* Duration bar */}
        <div className="flex-1 flex flex-col items-center justify-center px-3 relative min-w-[80px]">
          <span className="text-label-sm font-label-sm text-tertiary mb-1.5 font-medium">
            {duration}
          </span>
          <div className="w-full flex items-center">
            <div className="h-[2px] bg-outline-variant/50 flex-1 rounded-l-full" />
            <span className="material-symbols-outlined text-outline-variant text-[18px] mx-1 rotate-90 group-hover:text-primary transition-colors duration-300">
              flight
            </span>
            <div className="h-[2px] bg-outline-variant/50 flex-1 rounded-r-full" />
          </div>
          <span className="text-label-sm font-label-sm text-primary mt-1.5">Langsung</span>
        </div>

        {/* Arrival */}
        <div className="text-center shrink-0">
          <div className="text-headline-md font-headline-md text-on-surface tabular-nums">
            {formatTime(arrivingAt)}
          </div>
          <div className="text-label-sm font-label-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-md mt-1 inline-block">
            {destinationIata}
          </div>
        </div>
      </div>

      {/* Price + CTA */}
      <div className="flex flex-col items-end md:w-[28%] shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-outline-variant/50 md:border-l md:pl-gutter gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold text-right mb-0.5">
            Harga/orang
          </div>
          <div className="text-xl font-bold text-primary tracking-tight text-right">
            {formatCurrency(amount, currency)}
          </div>
          {/* Show currency code if not IDR so user knows it's foreign currency */}
          {currency !== "IDR" && (
            <div className="text-[10px] text-on-surface-variant text-right mt-0.5 font-medium">
              {currency}
            </div>
          )}
        </div>
        <button
          type="button"
          className="bg-primary text-on-primary px-6 py-2.5 rounded-lg text-label-md font-label-md hover:bg-surface-tint w-full shadow-[0px_4px_8px_-2px_rgba(0,101,145,0.35)] active:scale-95 transition-all duration-200 flex justify-center items-center gap-1.5"
        >
          <span>Pilih</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
