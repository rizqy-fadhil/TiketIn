// Helper functions to safely extract fields from a Duffel API offer object.
// Uses optional chaining + nullish coalescing to never crash on missing fields.
//
// Field sources verified against @duffel/api typings.d.ts AND live Duffel sandbox data:
//   - offer.total_amount / offer.total_currency               (top-level)
//   - offer.conditions.change_before_departure                (top-level — {allowed, penalty_amount, penalty_currency})
//   - offer.conditions.refund_before_departure                (top-level — same shape)
//   - offer.slices[].duration                                  (ISO 8601, e.g. "PT2H30M")
//   - offer.slices[].fare_brand_name                           (e.g. "Economy Light", "Economy Flex" — verified live)
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

/**
 * Verified live: each policy object from offer.conditions.change_before_departure
 * and offer.conditions.refund_before_departure has this shape.
 */
export interface DuffelConditionPolicy {
  /** Whether the action (change/refund) is allowed at all */
  allowed?: boolean;
  /** Penalty amount as a decimal string (e.g. "200.00"), or null if no penalty or not applicable */
  penalty_amount?: string | null;
  /** ISO 4217 currency of the penalty (e.g. "GBP"), or null */
  penalty_currency?: string | null;
}

export interface DuffelOfferConditions {
  change_before_departure?: DuffelConditionPolicy | null;
  refund_before_departure?: DuffelConditionPolicy | null;
}

export interface DuffelSlice {
  duration?: string;
  /**
   * Fare brand name for this slice (verified live from Duffel sandbox).
   * Examples: "Economy Light", "Economy Comfort", "Economy Flex", "Basic Economy".
   * Used to label fare variants in the multi-fare modal.
   * Field: offer.slices[0].fare_brand_name
   */
  fare_brand_name?: string | null;
  segments?: DuffelSegment[];
}

export interface DuffelOffer {
  id?: string;
  total_amount?: string;
  total_currency?: string;
  /**
   * Top-level fare conditions (verified live from Duffel sandbox).
   * Contains change_before_departure and refund_before_departure policies.
   * Field: offer.conditions
   */
  conditions?: DuffelOfferConditions | null;
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

// ─── Airline logo ─────────────────────────────────────────────────────────────

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

// ─── Fare brand & conditions ──────────────────────────────────────────────────

/**
 * Returns the fare brand name for the first slice.
 * Verified live: "Economy Light", "Economy Comfort", "Economy Flex", "Basic Economy".
 * Returns null when not provided by the airline.
 *
 * Field: offer.slices[0].fare_brand_name
 */
export function getFareBrandName(offer: DuffelOffer): string | null {
  return offer.slices?.[0]?.fare_brand_name ?? null;
}

/**
 * Returns the top-level offer conditions object (change + refund policies).
 * Verified live: both change_before_departure and refund_before_departure
 * have shape { allowed: boolean, penalty_amount: string|null, penalty_currency: string|null }.
 *
 * Field: offer.conditions
 */
export function getOfferConditions(offer: DuffelOffer): DuffelOfferConditions | null {
  return offer.conditions ?? null;
}

/** Full name of the origin airport, e.g. "Heathrow Airport" */
export function getOriginName(offer: DuffelOffer): string {
  return firstSegment(offer)?.origin?.name ?? "";
}

/** Full name of the destination airport */
export function getDestinationName(offer: DuffelOffer): string {
  return firstSegment(offer)?.destination?.name ?? "";
}

/**
 * Returns the total number of segments in the first slice.
 * 1 = direct flight, 2+ = connecting with transits.
 */
export function getSegmentCount(offer: DuffelOffer): number {
  return offer.slices?.[0]?.segments?.length ?? 1;
}

// ─── Flight grouping for multi-fare modal (Rencana A) ─────────────────────────

/**
 * A group of offers that share the same physical flight (same origin, destination,
 * departure time, arrival time, marketing carrier and flight number for the first
 * segment). Each entry in `fares` is a distinct fare option (different price,
 * baggage, and/or conditions) for that same departure.
 *
 * Verified against live Duffel sandbox data (LHR→JFK 2026-08-15):
 * - 235 total offers → 59 unique flight keys
 * - 49 of those 59 keys have 2-5 fare variants
 * - Variants differ in: total_amount, slices[0].fare_brand_name, offer.conditions
 *
 * NOTE: If you switch to a production Duffel token or a different airline set,
 * the grouping logic still works because the key is computed from actual segment
 * fields, not hardcoded. Airlines that don't expose multiple fare brands will
 * produce single-entry groups and the modal will show a single fare card.
 */
export interface FlightGroup {
  /** Stable key for React list rendering */
  key: string;
  /** Representative offer for displaying flight summary (use cheapest / first) */
  representative: DuffelOffer;
  /** All fare variants for this flight, sorted cheapest-first */
  fares: DuffelOffer[];
}

/**
 * Groups an array of DuffelOffers by flight identity:
 *   origin.iata_code + destination.iata_code + departing_at + arriving_at
 *   + marketing_carrier.iata_code + marketing_carrier_flight_number
 *
 * Each resulting FlightGroup contains all fare options for that flight,
 * sorted cheapest-first. The `representative` offer is the cheapest fare.
 *
 * Returns groups sorted cheapest-representative-first (same default sort as
 * the results list uses).
 */
export function groupOffersByFlight(offers: DuffelOffer[]): FlightGroup[] {
  const map = new Map<string, DuffelOffer[]>();

  for (const offer of offers) {
    const seg = offer.slices?.[0]?.segments?.[0];
    if (!seg) continue;

    const key = [
      seg.origin?.iata_code ?? "",
      seg.destination?.iata_code ?? "",
      seg.departing_at ?? "",
      seg.arriving_at ?? "",
      seg.marketing_carrier?.iata_code ?? "",
      seg.marketing_carrier_flight_number ?? "",
    ].join("|");

    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(offer);
  }

  const groups: FlightGroup[] = [];

  for (const [key, groupOffers] of map.entries()) {
    // Sort fares cheapest-first within each group
    const sorted = [...groupOffers].sort(
      (a, b) => getTotalAmount(a) - getTotalAmount(b)
    );
    groups.push({
      key,
      representative: sorted[0],
      fares: sorted,
    });
  }

  // Sort groups by cheapest fare price (same default as the results list)
  return groups.sort(
    (a, b) => getTotalAmount(a.representative) - getTotalAmount(b.representative)
  );
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
