"use client";

import { useState, useCallback } from "react";
import {
  DuffelOffer,
  FlightGroup,
  SortOption,
  sortOffers,
  lowestPriceOffer,
  fastestOffer,
  getTotalAmount,
  getTotalCurrency,
  getDuration,
  formatCurrency,
  groupOffersByFlight,
} from "@/app/lib/duffelHelpers";
import FlightResultCard from "./FlightResultCard";
import FlightFilters, {
  TimeFilter,
  emptyTimeFilter,
  isFilterActive,
  applyTimeFilter,
} from "./FlightFilters";
import FareSelectionModal from "./FareSelectionModal";

// ─── Skeleton loader ──────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-gutter animate-pulse flex flex-col md:flex-row gap-4">
      <div className="flex items-center gap-3 md:w-[30%]">
        <div className="w-12 h-12 rounded-xl bg-surface-container shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-4 bg-surface-container rounded-md w-3/4" />
          <div className="h-3 bg-surface-container rounded-md w-1/2" />
        </div>
      </div>
      <div className="flex-1 flex items-center justify-between px-4 gap-4">
        <div className="h-8 w-14 bg-surface-container rounded-md" />
        <div className="flex-1 h-2 bg-surface-container rounded-full mx-4" />
        <div className="h-8 w-14 bg-surface-container rounded-md" />
      </div>
      <div className="md:w-[28%] flex flex-col gap-3 items-end md:pl-6 md:border-l border-outline-variant/50">
        <div className="h-6 w-32 bg-surface-container rounded-md" />
        <div className="h-10 w-full bg-surface-container rounded-lg" />
      </div>
    </div>
  );
}

// ─── Error / empty states ─────────────────────────────────────────────────────

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-error-container flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-error text-3xl">error_outline</span>
      </div>
      <h3 className="text-headline-sm font-headline-sm text-on-surface mb-2">Terjadi Kesalahan</h3>
      <p className="text-body-md font-body-md text-on-surface-variant max-w-sm">{message}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-outline text-3xl">flight_off</span>
      </div>
      <h3 className="text-headline-sm font-headline-sm text-on-surface mb-2">
        Tidak Ada Penerbangan
      </h3>
      <p className="text-body-md font-body-md text-on-surface-variant max-w-sm">
        Tidak ada penerbangan ditemukan untuk rute dan tanggal ini. Coba ubah tanggal atau rute
        penerbangan Anda.
      </p>
    </div>
  );
}

/** Shown when active filters produce zero results */
function NoFilterResultsState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-outline text-3xl">manage_search</span>
      </div>
      <h3 className="text-headline-sm font-headline-sm text-on-surface mb-2">
        Tidak Ada Penerbangan yang Cocok
      </h3>
      <p className="text-body-md font-body-md text-on-surface-variant max-w-sm mb-5">
        Tidak ada penerbangan yang cocok dengan filter waktu yang dipilih. Coba hapus beberapa
        filter.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-lg text-label-md font-label-md hover:bg-surface-tint active:scale-95 transition-all duration-200 shadow-[0px_4px_8px_-2px_rgba(0,101,145,0.35)]"
      >
        <span className="material-symbols-outlined text-[16px]">filter_alt_off</span>
        Reset Filter
      </button>
    </div>
  );
}

// ─── Summary Bar ──────────────────────────────────────────────────────────────

interface SummaryBarProps {
  offers: DuffelOffer[];
  sortBy: SortOption;
  onSortChange: (s: SortOption) => void;
}

function SummaryBar({ offers, sortBy, onSortChange }: SummaryBarProps) {
  const cheapest = lowestPriceOffer(offers);
  const fastest = fastestOffer(offers);

  if (!cheapest && !fastest) return null;

  const cheapestAmount = cheapest ? getTotalAmount(cheapest) : 0;
  const cheapestCurrency = cheapest ? getTotalCurrency(cheapest) : "USD";
  const cheapestDuration = cheapest ? getDuration(cheapest) : "—";

  const fastestAmount = fastest ? getTotalAmount(fastest) : 0;
  const fastestCurrency = fastest ? getTotalCurrency(fastest) : "USD";
  const fastestDuration = fastest ? getDuration(fastest) : "—";

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-5">
      {/* Cheapest price card */}
      <button
        type="button"
        onClick={() => onSortChange("price")}
        aria-pressed={sortBy === "price"}
        className={[
          "flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 text-left",
          sortBy === "price"
            ? "bg-primary/8 border-primary shadow-[0px_0px_0px_2px_rgba(0,101,145,0.20)]"
            : "bg-surface-container-lowest border-outline-variant hover:border-primary/50 hover:bg-primary/4",
        ].join(" ")}
      >
        <div
          className={[
            "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors",
            sortBy === "price" ? "bg-primary text-on-primary" : "bg-surface-container text-primary",
          ].join(" ")}
        >
          <span className="material-symbols-outlined text-[18px]">sell</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant mb-0.5">
            Harga Termurah
          </div>
          <div
            className={[
              "text-base font-bold truncate",
              sortBy === "price" ? "text-primary" : "text-on-surface",
            ].join(" ")}
          >
            {formatCurrency(cheapestAmount, cheapestCurrency)}
          </div>
          <div className="text-[11px] text-on-surface-variant mt-0.5">
            Durasi {cheapestDuration}
          </div>
        </div>
        {sortBy === "price" && (
          <span className="material-symbols-outlined text-primary text-[18px] shrink-0">
            check_circle
          </span>
        )}
      </button>

      {/* Fastest duration card */}
      <button
        type="button"
        onClick={() => onSortChange("duration")}
        aria-pressed={sortBy === "duration"}
        className={[
          "flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 text-left",
          sortBy === "duration"
            ? "bg-tertiary/8 border-tertiary shadow-[0px_0px_0px_2px_rgba(70,140,74,0.20)]"
            : "bg-surface-container-lowest border-outline-variant hover:border-tertiary/50 hover:bg-tertiary/4",
        ].join(" ")}
      >
        <div
          className={[
            "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors",
            sortBy === "duration"
              ? "bg-tertiary text-on-tertiary"
              : "bg-surface-container text-tertiary",
          ].join(" ")}
        >
          <span className="material-symbols-outlined text-[18px]">timer</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant mb-0.5">
            Durasi Tercepat
          </div>
          <div
            className={[
              "text-base font-bold truncate",
              sortBy === "duration" ? "text-tertiary" : "text-on-surface",
            ].join(" ")}
          >
            {fastestDuration}
          </div>
          <div className="text-[11px] text-on-surface-variant mt-0.5">
            Mulai {formatCurrency(fastestAmount, fastestCurrency)}
          </div>
        </div>
        {sortBy === "duration" && (
          <span className="material-symbols-outlined text-tertiary text-[18px] shrink-0">
            check_circle
          </span>
        )}
      </button>
    </div>
  );
}

// ─── Props types ──────────────────────────────────────────────────────────────

type ListState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: DuffelOffer[] };

interface Props {
  state: ListState;
}

// ─── Main Results List ────────────────────────────────────────────────────────

export default function FlightResultsList({ state }: Props) {
  const [sortBy, setSortBy] = useState<SortOption>("price");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>(emptyTimeFilter());

  // Modal state — tracks the currently open FlightGroup (null = closed)
  const [selectedGroup, setSelectedGroup] = useState<FlightGroup | null>(null);

  // When a card's "Pilih" button is clicked, find the FlightGroup that contains
  // that offer and open the modal with the full group (all fare variants).
  const handleCardSelect = useCallback(
    (offer: DuffelOffer, groups: FlightGroup[]) => {
      const group =
        groups.find((g) => g.fares.some((f) => f.id === offer.id)) ?? null;
      setSelectedGroup(group);
    },
    []
  );
  // Note: navigation to /flights/booking is handled inside FareSelectionModal
  // (writes sessionStorage then calls router.push) — no parent handler needed.

  if (state.status === "idle") return null;

  if (state.status === "loading") {
    return (
      <div className="space-y-3 mt-6">
        <div className="flex justify-between items-center px-1 mb-4">
          <div className="h-4 w-40 bg-surface-container rounded animate-pulse" />
          <div className="h-9 w-36 bg-surface-container rounded-lg animate-pulse" />
        </div>
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (state.status === "error") {
    return <ErrorState message={state.message} />;
  }

  // status === "success"
  const { data } = state;

  if (data.length === 0) {
    return <EmptyState />;
  }

  // 1. Apply time filter
  const filtered = applyTimeFilter(data, timeFilter);

  // 2. Group offers by unique flight (origin+dest+dep+arr+carrier+flight_num)
  //    so the results list shows one card per physical flight, not per fare variant.
  //    The card for a group shows the cheapest fare price; clicking "Pilih" opens
  //    the modal with all fare variants for that flight.
  const groups = groupOffersByFlight(filtered);

  // 3. Sort groups by the representative offer (cheapest fare in the group)
  const sortedGroups = sortBy === "price"
    ? [...groups].sort((a, b) => getTotalAmount(a.representative) - getTotalAmount(b.representative))
    : [...groups].sort((a, b) => {
        const dA = a.representative.slices?.[0]?.duration ?? "";
        const dB = b.representative.slices?.[0]?.duration ?? "";
        // Convert ISO duration to minutes for comparison
        const toMin = (s: string) => {
          const m = s.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
          return m ? parseInt(m[1] ?? "0") * 60 + parseInt(m[2] ?? "0") : Infinity;
        };
        return toMin(dA) - toMin(dB);
      });

  const filterActive = isFilterActive(timeFilter);

  function resetFilter() {
    setTimeFilter(emptyTimeFilter());
  }

  return (
    <>
      <div className="mt-6">
        {/* Summary bar — clickable shortcut tiles for sort, based on ALL data */}
        <SummaryBar offers={data} sortBy={sortBy} onSortChange={setSortBy} />

        {/* ── Two-column layout: sidebar filter + results list ── */}
        <div className="flex gap-5 items-start">
          {/* ── Sidebar filter (sticky on desktop) ── */}
          <div className="hidden lg:block w-64 shrink-0 sticky top-[144px]">
            <FlightFilters
              allOffers={data}
              baseOffers={data}
              filter={timeFilter}
              onFilterChange={setTimeFilter}
            />
          </div>

          {/* ── Results column ── */}
          <div className="flex-1 min-w-0">
            {/* Mobile: inline filter (collapsible) */}
            <div className="lg:hidden mb-4">
              <FlightFilters
                allOffers={data}
                baseOffers={data}
                filter={timeFilter}
                onFilterChange={setTimeFilter}
              />
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4 px-1">
              <p className="text-body-sm font-body-sm text-on-surface-variant">
                {filterActive ? (
                  <>
                    Menampilkan{" "}
                    <span className="font-semibold text-on-surface">{sortedGroups.length}</span>
                    {" dari "}
                    <span className="font-semibold text-on-surface">
                      {groupOffersByFlight(data).length}
                    </span>{" "}
                    penerbangan
                  </>
                ) : (
                  <>
                    Menampilkan{" "}
                    <span className="font-semibold text-on-surface">{sortedGroups.length}</span>{" "}
                    penerbangan
                  </>
                )}
              </p>

              {/* Sort dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-body-sm font-body-sm text-on-surface-variant whitespace-nowrap">
                  Urutkan:
                </span>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-primary pointer-events-none">
                    sort
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="pl-8 pr-8 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary hover:border-primary transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="price">Harga Termurah</option>
                    <option value="duration">Durasi Tercepat</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[16px] text-outline pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            {/* Cards or empty-filter state */}
            {sortedGroups.length === 0 ? (
              <NoFilterResultsState onReset={resetFilter} />
            ) : (
              <div className="space-y-3">
                {sortedGroups.map((group) => (
                  /*
                   * Each card shows the representative offer (cheapest fare in the group).
                   * Clicking "Pilih" opens the FareSelectionModal with all fare variants
                   * (fares[]) for that physical flight.
                   *
                   * If the group has only 1 fare (airline doesn't offer multi-fare variants),
                   * the modal still opens but shows a single fare card — graceful Rencana B.
                   */
                  <FlightResultCard
                    key={group.key}
                    offer={group.representative}
                    onSelect={(offer) => handleCardSelect(offer, sortedGroups)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fare selection modal — rendered outside the layout flow to avoid stacking context issues */}
      <FareSelectionModal
        group={selectedGroup}
        onClose={() => setSelectedGroup(null)}
      />
    </>
  );
}

// Re-export the type so page.tsx can use it
export type { ListState };
