"use client";

import { useState } from "react";
import {
  DuffelOffer,
  TimeOfDay,
  TimeSlot,
  TIME_OF_DAY_SLOTS,
  getDepartingAt,
  getFinalArrivingAt,
  matchesTimeSlots,
} from "@/app/lib/duffelHelpers";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TimeFilter {
  departure: Set<TimeOfDay>;
  arrival: Set<TimeOfDay>;
}

export function emptyTimeFilter(): TimeFilter {
  return { departure: new Set(), arrival: new Set() };
}

export function isFilterActive(filter: TimeFilter): boolean {
  return filter.departure.size > 0 || filter.arrival.size > 0;
}

/**
 * Applies both departure and arrival time filters to an array of offers.
 * An offer passes if it matches ALL active filter groups (AND between groups,
 * OR within a group — same pattern used by Traveloka/Tiket.com).
 */
export function applyTimeFilter(offers: DuffelOffer[], filter: TimeFilter): DuffelOffer[] {
  return offers.filter((offer) => {
    const depOk = matchesTimeSlots(getDepartingAt(offer), filter.departure);
    const arrOk = matchesTimeSlots(getFinalArrivingAt(offer), filter.arrival);
    return depOk && arrOk;
  });
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  /** All fetched offers — used to compute available counts */
  allOffers: DuffelOffer[];
  /** Offers after OTHER filters (non-time) are applied — for live count display */
  baseOffers: DuffelOffer[];
  filter: TimeFilter;
  onFilterChange: (next: TimeFilter) => void;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface SlotRowProps {
  slot: TimeSlot;
  checked: boolean;
  count: number;
  onToggle: () => void;
}

function SlotRow({ slot, checked, count, onToggle }: SlotRowProps) {
  return (
    <label
      className={[
        "flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all duration-200 select-none",
        checked
          ? "bg-primary/8 border-primary shadow-[0px_0px_0px_2px_rgba(0,101,145,0.15)]"
          : "bg-surface-container-lowest border-outline-variant hover:border-primary/40 hover:bg-primary/4",
      ].join(" ")}
    >
      {/* Hidden native checkbox — keeps accessibility */}
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onToggle}
        aria-label={`${slot.label} (${slot.range})`}
      />

      {/* Icon bubble */}
      <div
        className={[
          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200",
          checked ? "bg-primary text-on-primary" : "bg-surface-container text-primary",
        ].join(" ")}
      >
        <span className="material-symbols-outlined text-[17px]">{slot.icon}</span>
      </div>

      {/* Label + range */}
      <div className="flex-1 min-w-0">
        <div
          className={[
            "text-sm font-semibold leading-tight",
            checked ? "text-primary" : "text-on-surface",
          ].join(" ")}
        >
          {slot.label}
        </div>
        <div className="text-[11px] text-on-surface-variant mt-0.5">{slot.range}</div>
      </div>

      {/* Count badge */}
      <span
        className={[
          "text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0",
          checked
            ? "bg-primary text-on-primary"
            : count > 0
            ? "bg-surface-container text-on-surface-variant"
            : "bg-surface-container text-outline",
        ].join(" ")}
      >
        {count}
      </span>

      {/* Check mark */}
      {checked && (
        <span className="material-symbols-outlined text-primary text-[16px] shrink-0">
          check_circle
        </span>
      )}
    </label>
  );
}

// ─── Section (Departure / Arrival) ───────────────────────────────────────────

interface SectionProps {
  title: string;
  icon: string;
  selected: Set<TimeOfDay>;
  /** baseOffers with the OTHER dimension's filter applied — for accurate counts */
  countOffers: DuffelOffer[];
  getTime: (offer: DuffelOffer) => string;
  onToggle: (id: TimeOfDay) => void;
}

function FilterSection({ title, icon, selected, countOffers, getTime, onToggle }: SectionProps) {
  return (
    <div>
      {/* Section header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-[16px]">{icon}</span>
        </div>
        <span className="text-label-sm font-label-sm font-semibold text-on-surface">{title}</span>
      </div>

      <div className="space-y-2">
        {TIME_OF_DAY_SLOTS.map((slot) => {
          // Count offers from countOffers whose time falls in this slot
          const count = countOffers.filter((offer) => {
            const iso = getTime(offer);
            if (!iso) return false;
            try {
              const h = new Date(iso).getHours();
              return h >= slot.startHour && h < slot.endHour;
            } catch {
              return false;
            }
          }).length;

          return (
            <SlotRow
              key={slot.id}
              slot={slot}
              checked={selected.has(slot.id)}
              count={count}
              onToggle={() => onToggle(slot.id)}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── Main FlightFilters component ─────────────────────────────────────────────

export default function FlightFilters({ allOffers, baseOffers, filter, onFilterChange }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  const active = isFilterActive(filter);

  function toggleDep(id: TimeOfDay) {
    const next = new Set(filter.departure);
    next.has(id) ? next.delete(id) : next.add(id);
    onFilterChange({ ...filter, departure: next });
  }

  function toggleArr(id: TimeOfDay) {
    const next = new Set(filter.arrival);
    next.has(id) ? next.delete(id) : next.add(id);
    onFilterChange({ ...filter, arrival: next });
  }

  function reset() {
    onFilterChange(emptyTimeFilter());
  }

  // For departure count: apply only the arrival filter to baseOffers
  const depCountBase = baseOffers.filter((o) =>
    matchesTimeSlots(getFinalArrivingAt(o), filter.arrival)
  );
  // For arrival count: apply only the departure filter to baseOffers
  const arrCountBase = baseOffers.filter((o) =>
    matchesTimeSlots(getDepartingAt(o), filter.departure)
  );

  return (
    <aside
      aria-label="Filter penerbangan"
      className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-[0px_4px_12px_-2px_rgba(15,23,42,0.03)] overflow-hidden"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-outline-variant bg-surface-container-low/50">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">tune</span>
          <span className="text-label-md font-label-md font-semibold text-on-surface">Filter</span>
          {active && (
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" title="Filter aktif" />
          )}
        </div>
        <div className="flex items-center gap-2">
          {active && (
            <button
              type="button"
              onClick={reset}
              className="text-[11px] font-semibold text-primary hover:text-surface-tint px-2 py-1 rounded-md hover:bg-primary/8 transition-all duration-200"
            >
              Reset
            </button>
          )}
          {/* Collapse toggle (useful on mobile) */}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Tampilkan filter" : "Sembunyikan filter"}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-surface-container transition-colors duration-200"
          >
            <span
              className={[
                "material-symbols-outlined text-outline text-[18px] transition-transform duration-300",
                collapsed ? "rotate-180" : "",
              ].join(" ")}
            >
              expand_less
            </span>
          </button>
        </div>
      </div>

      {/* ── Body (collapsible) ── */}
      <div
        className={[
          "overflow-hidden transition-all duration-300",
          collapsed ? "max-h-0" : "max-h-[9999px]",
        ].join(" ")}
      >
        <div className="p-4 space-y-6">
          {/* Active filter summary pill */}
          {active && (
            <div className="flex flex-wrap gap-1.5">
              {[...filter.departure].map((id) => {
                const slot = TIME_OF_DAY_SLOTS.find((s) => s.id === id)!;
                return (
                  <span
                    key={`dep-${id}`}
                    className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                  >
                    <span className="material-symbols-outlined text-[11px]">flight_takeoff</span>
                    {slot.label}
                    <button
                      type="button"
                      onClick={() => toggleDep(id)}
                      className="ml-0.5 hover:text-error transition-colors"
                      aria-label={`Hapus filter keberangkatan ${slot.label}`}
                    >
                      <span className="material-symbols-outlined text-[11px]">close</span>
                    </button>
                  </span>
                );
              })}
              {[...filter.arrival].map((id) => {
                const slot = TIME_OF_DAY_SLOTS.find((s) => s.id === id)!;
                return (
                  <span
                    key={`arr-${id}`}
                    className="inline-flex items-center gap-1 bg-tertiary/10 text-tertiary border border-tertiary/20 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                  >
                    <span className="material-symbols-outlined text-[11px]">flight_land</span>
                    {slot.label}
                    <button
                      type="button"
                      onClick={() => toggleArr(id)}
                      className="ml-0.5 hover:text-error transition-colors"
                      aria-label={`Hapus filter kedatangan ${slot.label}`}
                    >
                      <span className="material-symbols-outlined text-[11px]">close</span>
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          {/* ── Departure filter section ── */}
          <FilterSection
            title="Waktu Keberangkatan"
            icon="flight_takeoff"
            selected={filter.departure}
            countOffers={depCountBase}
            getTime={getDepartingAt}
            onToggle={toggleDep}
          />

          {/* Divider */}
          <div className="border-t border-outline-variant/60" />

          {/* ── Arrival filter section ── */}
          <FilterSection
            title="Waktu Kedatangan"
            icon="flight_land"
            selected={filter.arrival}
            countOffers={arrCountBase}
            getTime={getFinalArrivingAt}
            onToggle={toggleArr}
          />
        </div>
      </div>
    </aside>
  );
}
