// Helper functions to safely extract fields from a Duffel API offer object.
// Uses optional chaining + nullish coalescing to never crash on missing fields.
//
// Field sources verified against @duffel/api typings.d.ts:
//   - offer.total_amount / offer.total_currency               (top-level)
//   - offer.slices[].duration                                  (ISO 8601, e.g. "PT2H30M")
//   - offer.slices[].segments[].departing_at / arriving_at    (ISO 8601 datetime)
//   - offer.slices[].segments[].origin.iata_code              (e.g. "CGK")
//   - offer.slices[].segments[].destination.iata_code         (e.g. "SUB")
//   - offer.slices[].segments[].marketing_carrier.name        (e.g. "Garuda Indonesia")
//   - offer.slices[].segments[].marketing_carrier.iata_code   (e.g. "GA")
//   - offer.slices[].segments[].marketing_carrier.logo_symbol_url  (nullable string)
//   - offer.slices[].segments[].marketing_carrier.logo_lockup_url  (nullable string)
//   - offer.slices[].segments[].marketing_carrier_flight_number    (e.g. "777")
//   - offer.slices[].segments[].passengers[].baggages[]        (type: 'checked'|'carry_on', quantity: number)

// ─── Type definitions ─────────────────────────────────────────────────────────

export interface DuffelCarrier {
  name?: string;
  iata_code?: string;
  /** Duffel standard field: square symbol/icon logo */
  logo_symbol_url?: string | null;
  /** Duffel standard field: horizontal lockup logo with name */
  logo_lockup_url?: string | null;
}

export interface DuffelBaggage {
  type?: "checked" | "carry_on";
  quantity?: number;
}

export interface DuffelSegmentPassenger {
  baggages?: DuffelBaggage[];
  cabin_class?: string;
  cabin_class_marketing_name?: string;
  passenger_id?: string;
}

export interface DuffelSegment {
  departing_at?: string;
  arriving_at?: string;
  origin?: { iata_code?: string; name?: string };
  destination?: { iata_code?: string; name?: string };
  marketing_carrier?: DuffelCarrier;
  marketing_carrier_flight_number?: string;
  passengers?: DuffelSegmentPassenger[];
  duration?: string;
}

export interface DuffelSlice {
  duration?: string;
  segments?: DuffelSegment[];
}

export interface DuffelOffer {
  id?: string;
  total_amount?: string;
  total_currency?: string;
  slices?: DuffelSlice[];
}

// ─── Safe field accessors ─────────────────────────────────────────────────────

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

/**
 * Returns arriving_at from the FIRST segment of the first slice.
 * Used for display on the card (consistent with getDepartingAt origin).
 * For direct flights this equals the final arrival; for transits use getFinalArrivingAt.
 */
export function getArrivingAt(offer: DuffelOffer): string {
  return firstSegment(offer)?.arriving_at ?? "";
}

/**
 * Returns arriving_at from the LAST segment of the first slice.
 * This is the true final-destination arrival time even for connecting flights.
 *
 * Field: offer.slices[0].segments[lastIndex].arriving_at
 */
export function getFinalArrivingAt(offer: DuffelOffer): string {
  const segments = offer.slices?.[0]?.segments;
  if (!segments || segments.length === 0) return "";
  return segments[segments.length - 1]?.arriving_at ?? "";
}

export function getOriginIata(offer: DuffelOffer): string {
  return firstSegment(offer)?.origin?.iata_code ?? "N/A";
}

export function getDestinationIata(offer: DuffelOffer): string {
  return firstSegment(offer)?.destination?.iata_code ?? "N/A";
}

export function getDuration(offer: DuffelOffer): string {
  // Duffel duration is ISO 8601 like "PT2H30M" at the slice level
  const raw = offer.slices?.[0]?.duration ?? "";
  return parseDuration(raw);
}

export function getTotalAmount(offer: DuffelOffer): number {
  return parseFloat(offer.total_amount ?? "0") || 0;
}

export function getTotalCurrency(offer: DuffelOffer): string {
  return offer.total_currency ?? "USD";
}

// ─── New: Airline logo ────────────────────────────────────────────────────────

/**
 * Returns the best available logo URL for the marketing carrier.
 * Prefers logo_symbol_url (square icon) over logo_lockup_url (horizontal).
 * Returns null if neither is available so callers can show a fallback.
 *
 * Field: offer.slices[0].segments[0].marketing_carrier.logo_symbol_url
 * (from @duffel/api Airline interface — verified in typings.d.ts:5061-5062)
 */
export function getAirlineLogoUrl(offer: DuffelOffer): string | null {
  const carrier = firstSegment(offer)?.marketing_carrier;
  return carrier?.logo_symbol_url ?? carrier?.logo_lockup_url ?? null;
}

// ─── New: Baggage info ────────────────────────────────────────────────────────

export interface BaggageInfo {
  /** true if at least one checked bag with quantity > 0 is included */
  hasChecked: boolean;
  /** total quantity of checked bags (0 if none) */
  checkedQuantity: number;
  /** true if carry-on is included */
  hasCarryOn: boolean;
  /** Human-readable label, e.g. "1 Koper" / "Tanpa Bagasi" */
  label: string;
}

/**
 * Extracts baggage allowance included in the offer (not add-ons).
 *
 * Field path: offer.slices[0].segments[0].passengers[0].baggages[]
 *   Each baggage: { type: 'checked' | 'carry_on', quantity: number }
 * (verified in typings.d.ts:3382-3386, 3468-3478)
 *
 * Returns a BaggageInfo object or a safe fallback object — never throws.
 */
export function getBaggageInfo(offer: DuffelOffer): BaggageInfo {
  try {
    // Aggregate baggage across ALL slices, segments, and passengers
    let checkedQty = 0;
    let carryOnQty = 0;

    const slices = offer.slices ?? [];
    for (const slice of slices) {
      const segments = slice.segments ?? [];
      for (const seg of segments) {
        const passengers = seg.passengers ?? [];
        for (const pax of passengers) {
          const bags = pax.baggages ?? [];
          for (const bag of bags) {
            const qty = bag.quantity ?? 0;
            if (bag.type === "checked") checkedQty += qty;
            if (bag.type === "carry_on") carryOnQty += qty;
          }
        }
      }
    }

    const hasChecked = checkedQty > 0;
    const hasCarryOn = carryOnQty > 0;

    let label: string;
    if (hasChecked) {
      label = `${checkedQty} Koper`;
    } else if (hasCarryOn) {
      label = "Kabin Saja";
    } else {
      label = "Tanpa Bagasi";
    }

    return { hasChecked, checkedQuantity: checkedQty, hasCarryOn, label };
  } catch {
    // Defensive fallback — never crash the UI
    return { hasChecked: false, checkedQuantity: 0, hasCarryOn: false, label: "—" };
  }
}

// ─── New: Summary helpers ─────────────────────────────────────────────────────

/**
 * Returns the offer with the lowest total_amount from an array.
 * Returns null for empty arrays.
 */
export function lowestPriceOffer(offers: DuffelOffer[]): DuffelOffer | null {
  if (!offers.length) return null;
  return offers.reduce((best, cur) =>
    getTotalAmount(cur) < getTotalAmount(best) ? cur : best
  );
}

/**
 * Returns the offer with the shortest total flight duration from an array.
 * Returns null for empty arrays.
 */
export function fastestOffer(offers: DuffelOffer[]): DuffelOffer | null {
  if (!offers.length) return null;
  return offers.reduce((best, cur) => {
    const da = durationToMinutes(cur.slices?.[0]?.duration ?? "");
    const db = durationToMinutes(best.slices?.[0]?.duration ?? "");
    return da < db ? cur : best;
  });
}

// ─── Formatters ───────────────────────────────────────────────────────────────

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

/**
 * Formats a price amount with its currency code using Intl.NumberFormat.
 * Uses the currency code as-is (e.g. USD, IDR, GBP) — never hardcodes "Rp".
 * Falls back gracefully if the currency code is unrecognized by the browser.
 *
 * @param amount   Numeric amount (already parsed from Duffel's string field)
 * @param currency ISO 4217 currency code from offer.total_currency
 */
export function formatCurrency(amount: number, currency: string): string {
  if (!currency || !amount && amount !== 0) return "—";
  try {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    // Fallback: show raw currency code + formatted number if browser doesn't know the currency
    return `${currency} ${amount.toLocaleString("id-ID")}`;
  }
}

/**
 * @deprecated Use formatCurrency(amount, currency) instead.
 * Kept for backward compat with existing callers.
 */
export function formatPrice(amount: number, currency: string): string {
  return formatCurrency(amount, currency);
}

export function parseDuration(iso: string): string {
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

// ─── Time-of-day filter helpers ──────────────────────────────────────────────

/**
 * The four preset time-of-day buckets used in the filter sidebar.
 * Ranges are [startHour, endHour) in 24-hour format.
 * 'night' is [18, 24) — matched as hour >= 18.
 */
export type TimeOfDay = "morning" | "midday" | "afternoon" | "night";

export interface TimeSlot {
  id: TimeOfDay;
  label: string;
  range: string;
  /** Inclusive start hour (0-23) */
  startHour: number;
  /** Exclusive end hour (1-24); use 24 to mean end of day */
  endHour: number;
  icon: string;
}

export const TIME_OF_DAY_SLOTS: TimeSlot[] = [
  { id: "morning",   label: "Pagi",  range: "00:00 – 06:00", startHour: 0,  endHour: 6,  icon: "bedtime" },
  { id: "midday",    label: "Siang", range: "06:00 – 12:00", startHour: 6,  endHour: 12, icon: "wb_sunny" },
  { id: "afternoon", label: "Sore",  range: "12:00 – 18:00", startHour: 12, endHour: 18, icon: "partly_cloudy_day" },
  { id: "night",     label: "Malam", range: "18:00 – 24:00", startHour: 18, endHour: 24, icon: "nightlight" },
];

/**
 * Extracts the hour (0-23) from an ISO 8601 datetime string.
 * Returns -1 if the string is empty or unparseable.
 */
export function getHourFromIso(isoString: string): number {
  if (!isoString) return -1;
  try {
    return new Date(isoString).getHours();
  } catch {
    return -1;
  }
}

/**
 * Returns true if `hour` falls within the given TimeSlot.
 * An hour of -1 (parse error) never matches.
 */
export function hourMatchesSlot(hour: number, slot: TimeSlot): boolean {
  if (hour < 0) return false;
  return hour >= slot.startHour && hour < slot.endHour;
}

/**
 * Returns true if the ISO datetime falls within ANY of the selected TimeOfDay ids.
 * If selectedSlots is empty, returns true (= no filter applied).
 */
export function matchesTimeSlots(isoString: string, selectedSlots: Set<TimeOfDay>): boolean {
  if (selectedSlots.size === 0) return true;
  const hour = getHourFromIso(isoString);
  if (hour < 0) return true; // parse error → don't hide the offer
  for (const slotId of selectedSlots) {
    const slot = TIME_OF_DAY_SLOTS.find((s) => s.id === slotId);
    if (slot && hourMatchesSlot(hour, slot)) return true;
  }
  return false;
}

// ─── Sort helpers ─────────────────────────────────────────────────────────────

export type SortOption = "price" | "duration";

export function sortOffers(offers: DuffelOffer[], by: SortOption): DuffelOffer[] {
  return [...offers].sort((a, b) => {
    if (by === "price") return getTotalAmount(a) - getTotalAmount(b);
    const da = durationToMinutes(a.slices?.[0]?.duration ?? "");
    const db = durationToMinutes(b.slices?.[0]?.duration ?? "");
    return da - db;
  });
}

export function durationToMinutes(iso: string): number {
  if (!iso) return Infinity;
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return Infinity;
  return parseInt(match[1] ?? "0", 10) * 60 + parseInt(match[2] ?? "0", 10);
}
