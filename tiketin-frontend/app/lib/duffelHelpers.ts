// Helper functions to safely extract fields from a Duffel API offer object.
// Uses optional chaining + nullish coalescing to never crash on missing fields.

export interface DuffelOffer {
  id?: string;
  total_amount?: string;
  total_currency?: string;
  slices?: DuffelSlice[];
}

interface DuffelSlice {
  duration?: string;
  segments?: DuffelSegment[];
}

interface DuffelSegment {
  departing_at?: string;
  arriving_at?: string;
  origin?: { iata_code?: string };
  destination?: { iata_code?: string };
  marketing_carrier?: { name?: string; iata_code?: string };
  marketing_carrier_flight_number?: string;
}

// ─── safe field accessors ────────────────────────────────────────────────────

function firstSegment(offer: DuffelOffer): DuffelSegment | undefined {
  return offer.slices?.[0]?.segments?.[0];
}

export function getCarrierName(offer: DuffelOffer): string {
  return firstSegment(offer)?.marketing_carrier?.name ?? "N/A";
}

export function getFlightNumber(offer: DuffelOffer): string {
  const seg = firstSegment(offer);
  const carrier = seg?.marketing_carrier?.iata_code ?? "";
  const num = seg?.marketing_carrier_flight_number ?? "";
  return carrier && num ? `${carrier}-${num}` : "N/A";
}

export function getDepartingAt(offer: DuffelOffer): string {
  return firstSegment(offer)?.departing_at ?? "";
}

export function getArrivingAt(offer: DuffelOffer): string {
  return firstSegment(offer)?.arriving_at ?? "";
}

export function getOriginIata(offer: DuffelOffer): string {
  return firstSegment(offer)?.origin?.iata_code ?? "N/A";
}

export function getDestinationIata(offer: DuffelOffer): string {
  return firstSegment(offer)?.destination?.iata_code ?? "N/A";
}

export function getDuration(offer: DuffelOffer): string {
  // Duffel duration is ISO 8601 like "PT2H30M"
  const raw = offer.slices?.[0]?.duration ?? "";
  return parseDuration(raw);
}

export function getTotalAmount(offer: DuffelOffer): number {
  return parseFloat(offer.total_amount ?? "0") || 0;
}

export function getTotalCurrency(offer: DuffelOffer): string {
  return offer.total_currency ?? "IDR";
}

// ─── formatters ─────────────────────────────────────────────────────────────

export function formatTime(isoString: string): string {
  if (!isoString) return "N/A";
  try {
    return new Date(isoString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return "N/A";
  }
}

export function formatPrice(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("id-ID")}`;
  }
}

function parseDuration(iso: string): string {
  if (!iso) return "N/A";
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return iso;
  const hours = parseInt(match[1] ?? "0", 10);
  const minutes = parseInt(match[2] ?? "0", 10);
  const parts: string[] = [];
  if (hours) parts.push(`${hours}j`);
  if (minutes) parts.push(`${minutes}m`);
  return parts.length ? parts.join(" ") : "N/A";
}

// ─── sort helpers ────────────────────────────────────────────────────────────

export type SortOption = "price" | "duration";

export function sortOffers(offers: DuffelOffer[], by: SortOption): DuffelOffer[] {
  return [...offers].sort((a, b) => {
    if (by === "price") return getTotalAmount(a) - getTotalAmount(b);
    // duration sort: compare raw ISO durations lexicographically after normalization
    const da = durationToMinutes(a.slices?.[0]?.duration ?? "");
    const db = durationToMinutes(b.slices?.[0]?.duration ?? "");
    return da - db;
  });
}

function durationToMinutes(iso: string): number {
  if (!iso) return Infinity;
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return Infinity;
  return parseInt(match[1] ?? "0", 10) * 60 + parseInt(match[2] ?? "0", 10);
}
