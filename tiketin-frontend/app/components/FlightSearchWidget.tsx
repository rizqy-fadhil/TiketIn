"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { INDONESIAN_AIRPORTS, Airport } from "@/app/lib/airports";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FlightSearchWidgetProps {
  /** "hero" = large card used on homepage; "compact" = horizontal bar on results page */
  mode: "hero" | "compact";
  /** Pre-fill values (e.g. read from URL query params on results page) */
  initialOrigin?: string;
  initialDestination?: string;
  initialDate?: string;
  /** Called after validation passes. Widget handles routing internally. */
  onSearch?: (origin: string, destination: string, date: string) => void;
  isLoading?: boolean;
}

// ─── Airport Combobox ─────────────────────────────────────────────────────────

function AirportCombobox({
  id,
  label,
  icon,
  value,
  onChange,
  excludeIata,
  compact = false,
}: {
  id: string;
  label: string;
  icon: string;
  value: string;
  onChange: (iata: string) => void;
  excludeIata?: string;
  compact?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = INDONESIAN_AIRPORTS.find((a) => a.iata === value);
  const filtered = INDONESIAN_AIRPORTS.filter(
    (a) =>
      a.iata !== excludeIata &&
      (a.iata.toLowerCase().includes(query.toLowerCase()) ||
        a.city.toLowerCase().includes(query.toLowerCase()) ||
        a.name.toLowerCase().includes(query.toLowerCase()))
  );

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(airport: Airport) {
    onChange(airport.iata);
    setQuery("");
    setOpen(false);
  }

  // Compact mode: tighter display; Hero mode: normal
  const triggerClass = compact
    ? "w-full flex items-center gap-1.5 bg-surface border border-outline-variant rounded-lg px-2.5 py-2 text-left hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 min-w-[120px]"
    : "w-full flex items-center gap-2 bg-surface border border-outline-variant rounded-lg px-3 py-3 text-left hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200";

  return (
    <div ref={containerRef} className="relative flex-1 min-w-0">
      {!compact && (
        <label
          htmlFor={id}
          className="block text-label-sm font-label-sm text-on-surface-variant mb-1.5"
        >
          {label}
        </label>
      )}

      <button id={id} type="button" onClick={() => setOpen((o) => !o)} className={triggerClass}>
        <span className={`material-symbols-outlined text-primary shrink-0 ${compact ? "text-[16px]" : "text-[20px]"}`}>
          {icon}
        </span>

        {selected ? (
          compact ? (
            <span className="flex-1 min-w-0 text-left">
              <span className="block text-xs text-on-surface-variant leading-none mb-0.5">{label}</span>
              <span className="block text-sm font-bold text-on-surface truncate">
                {selected.iata}
                <span className="font-normal text-on-surface-variant ml-1 text-xs">{selected.city}</span>
              </span>
            </span>
          ) : (
            <span className="flex-1 min-w-0">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant leading-none mb-0.5">
                {label}
              </span>
              <span className="block font-bold text-on-surface text-base leading-tight truncate">
                {selected.city}
              </span>
              <span className="block text-xs text-on-surface-variant">{selected.iata} · {selected.name.split(" ").slice(0, 3).join(" ")}</span>
            </span>
          )
        ) : (
          compact ? (
            <span className="flex-1 min-w-0 text-left">
              <span className="block text-xs text-on-surface-variant leading-none mb-0.5">{label}</span>
              <span className="block text-sm text-on-surface-variant/60">Pilih…</span>
            </span>
          ) : (
            <span className="flex-1">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant leading-none mb-0.5">
                {label}
              </span>
              <span className="block text-on-surface-variant text-sm">Pilih Bandara…</span>
            </span>
          )
        )}

        <span className={`material-symbols-outlined text-outline shrink-0 ${compact ? "text-[14px]" : "text-[18px]"}`}>
          {open ? "expand_less" : "expand_more"}
        </span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-[60] w-72 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_20px_40px_-8px_rgba(15,23,42,0.18)] overflow-hidden">
          <div className="p-2 border-b border-outline-variant/50">
            <div className="flex items-center gap-2 bg-surface-container-low rounded-lg px-3 py-2">
              <span className="material-symbols-outlined text-[15px] text-outline">search</span>
              <input
                autoFocus
                type="text"
                placeholder="Cari kota atau kode bandara…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none"
              />
            </div>
          </div>
          <ul className="max-h-60 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-on-surface-variant text-center">
                Bandara tidak ditemukan
              </li>
            ) : (
              filtered.map((airport) => (
                <li key={airport.iata}>
                  <button
                    type="button"
                    onClick={() => handleSelect(airport)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-surface-container-low transition-colors text-left"
                  >
                    <span className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
                      <span className="text-primary font-bold text-xs">{airport.iata}</span>
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold text-on-surface truncate">
                        {airport.city}
                      </span>
                      <span className="block text-xs text-on-surface-variant truncate">
                        {airport.name}
                      </span>
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Date Button (custom styled wrapper around <input type="date">) ────────────

function DatePicker({
  label,
  value,
  onChange,
  compact = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  compact?: boolean;
}) {
  const today = new Date().toISOString().split("T")[0];

  // Display formatted date for compact mode
  function displayDate(raw: string) {
    if (!raw) return null;
    try {
      return new Date(raw + "T00:00:00").toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return raw;
    }
  }

  if (compact) {
    return (
      <div className="relative flex-1 min-w-[130px]">
        <div className="relative flex items-center gap-1.5 bg-surface border border-outline-variant rounded-lg px-2.5 py-2 hover:border-primary transition-all duration-200 cursor-pointer">
          <span className="material-symbols-outlined text-primary text-[16px] shrink-0">calendar_today</span>
          <span className="flex-1 min-w-0">
            <span className="block text-xs text-on-surface-variant leading-none mb-0.5">{label}</span>
            <span className="block text-sm font-bold text-on-surface">
              {displayDate(value) ?? <span className="text-on-surface-variant/60 font-normal">Pilih…</span>}
            </span>
          </span>
          <input
            type="date"
            value={value}
            min={today}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex-1 min-w-0">
      <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1.5">
        {label}
      </label>
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-primary pointer-events-none">
          calendar_today
        </span>
        <input
          type="date"
          value={value}
          min={today}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-11 pr-3 py-3 bg-surface border border-outline-variant rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary hover:border-primary transition-all duration-200"
        />
      </div>
    </div>
  );
}

// ─── Main Widget ──────────────────────────────────────────────────────────────

export default function FlightSearchWidget({
  mode,
  initialOrigin = "",
  initialDestination = "",
  initialDate = "",
  onSearch,
  isLoading = false,
}: FlightSearchWidgetProps) {
  const router = useRouter();

  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);
  const [date, setDate] = useState(initialDate);

  // Sync when parent changes initialValues (e.g. URL params update)
  useEffect(() => { setOrigin(initialOrigin); }, [initialOrigin]);
  useEffect(() => { setDestination(initialDestination); }, [initialDestination]);
  useEffect(() => { setDate(initialDate); }, [initialDate]);

  const sameError = !!(origin && destination && origin === destination);
  const canSubmit = !!(origin && destination && date && !sameError && !isLoading);

  function handleSwap() {
    setOrigin(destination);
    setDestination(origin);
  }

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!canSubmit) return;

      if (onSearch) {
        // Results page: let parent handle fetch + URL update
        onSearch(origin, destination, date);
      } else {
        // Homepage: navigate to results page with query params
        const params = new URLSearchParams({ origin, destination, date });
        router.push(`/flights/search?${params.toString()}`);
      }
    },
    [canSubmit, onSearch, origin, destination, date, router]
  );

  // ── COMPACT layout (results page search bar) ────────────────────────────────
  if (mode === "compact") {
    return (
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-wrap"
      >
        {/* Origin */}
        <AirportCombobox
          id="compact-origin"
          label="Asal"
          icon="flight_takeoff"
          value={origin}
          onChange={setOrigin}
          excludeIata={destination}
          compact
        />

        {/* Swap */}
        <button
          type="button"
          onClick={handleSwap}
          disabled={!origin && !destination}
          title="Tukar"
          className="group self-center sm:self-auto w-8 h-8 rounded-full border border-outline-variant bg-surface hover:bg-primary hover:border-primary hover:text-on-primary text-on-surface-variant flex items-center justify-center transition-all duration-300 disabled:opacity-40 shrink-0"
        >
          <span className="material-symbols-outlined text-[16px] group-hover:rotate-180 transition-transform duration-300">
            swap_horiz
          </span>
        </button>

        {/* Destination */}
        <AirportCombobox
          id="compact-destination"
          label="Tujuan"
          icon="flight_land"
          value={destination}
          onChange={setDestination}
          excludeIata={origin}
          compact
        />

        {/* Date */}
        <DatePicker label="Berangkat" value={date} onChange={setDate} compact />

        {/* Error */}
        {sameError && (
          <span className="text-error text-xs flex items-center gap-1 shrink-0">
            <span className="material-symbols-outlined text-[14px]">error</span>
            Asal ≠ Tujuan
          </span>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit}
          className="h-[44px] px-4 bg-primary text-on-primary text-label-md font-label-md rounded-lg flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-[0px_2px_8px_-2px_rgba(0,101,145,0.4)] whitespace-nowrap"
        >
          {isLoading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
              <span>Mencari…</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[16px]">search</span>
              <span>Cari Ulang</span>
            </>
          )}
        </button>
      </form>
    );
  }

  // ── HERO layout (homepage) ──────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Tab strip */}
      <div className="flex gap-1 mb-5 border-b border-outline-variant/40 pb-3">
        <span className="flex items-center gap-1.5 text-primary border-b-2 border-primary pb-1 font-label-md text-label-md">
          <span className="material-symbols-outlined text-[18px] material-symbols-fill">flight</span>
          Pesawat
        </span>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_1fr] gap-3 items-end">
        {/* Origin */}
        <AirportCombobox
          id="hero-origin"
          label="Asal"
          icon="flight_takeoff"
          value={origin}
          onChange={setOrigin}
          excludeIata={destination}
        />

        {/* Swap */}
        <div className="flex items-end pb-[3px]">
          <button
            type="button"
            onClick={handleSwap}
            disabled={!origin && !destination}
            title="Tukar Asal & Tujuan"
            className="group w-10 h-10 rounded-full border border-outline-variant bg-surface hover:bg-primary hover:border-primary hover:text-on-primary text-on-surface-variant flex items-center justify-center transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px] group-hover:rotate-180 transition-transform duration-300">
              swap_horiz
            </span>
          </button>
        </div>

        {/* Destination */}
        <AirportCombobox
          id="hero-destination"
          label="Tujuan"
          icon="flight_land"
          value={destination}
          onChange={setDestination}
          excludeIata={origin}
        />

        {/* Date */}
        <DatePicker label="Tanggal Pergi" value={date} onChange={setDate} />
      </div>

      {/* Inline error */}
      {sameError && (
        <div className="mt-3 flex items-center gap-1.5 text-error text-sm">
          <span className="material-symbols-outlined text-[16px]">error</span>
          <span>Kota asal dan tujuan tidak boleh sama.</span>
        </div>
      )}

      {/* CTA */}
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={!canSubmit}
          className="h-12 px-8 bg-primary text-on-primary font-bold text-label-md rounded-lg flex items-center gap-2 shadow-[0px_4px_16px_-2px_rgba(0,101,145,0.45)] hover:opacity-90 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          <span className="material-symbols-outlined text-[20px]">search</span>
          <span>Cari Tiket</span>
        </button>
      </div>
    </form>
  );
}
