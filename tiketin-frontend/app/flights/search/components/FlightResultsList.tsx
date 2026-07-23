"use client";

import { useState } from "react";
import { DuffelOffer, SortOption, sortOffers } from "@/app/lib/duffelHelpers";
import FlightResultCard from "./FlightResultCard";

// ─── Skeleton loader ─────────────────────────────────────────────────────────

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

// ─── Error / empty states ────────────────────────────────────────────────────

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

// ─── Props types ─────────────────────────────────────────────────────────────

type ListState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: DuffelOffer[] };

interface Props {
  state: ListState;
}

// ─── Main Results List ───────────────────────────────────────────────────────

export default function FlightResultsList({ state }: Props) {
  const [sortBy, setSortBy] = useState<SortOption>("price");

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

  const sorted = sortOffers(data, sortBy);

  return (
    <div className="mt-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4 px-1">
        <p className="text-body-sm font-body-sm text-on-surface-variant">
          Menampilkan{" "}
          <span className="font-semibold text-on-surface">{data.length}</span> penerbangan
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

      {/* Cards */}
      <div className="space-y-3">
        {sorted.map((offer, index) => (
          <FlightResultCard key={offer.id ?? index} offer={offer} />
        ))}
      </div>
    </div>
  );
}

// Re-export the type so page.tsx can use it
export type { ListState };
