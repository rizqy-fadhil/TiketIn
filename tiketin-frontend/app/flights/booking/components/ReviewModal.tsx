"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ContactForm,
  PassengerForm,
  NATIONALITIES,
  MONTHS,
  BOOKING_PASSENGER_KEY,
} from "./BookingInner";

interface Props {
  isOpen: boolean;
  contact: ContactForm;
  passenger: PassengerForm;
  onClose: () => void;
}

export default function ReviewModal({
  isOpen,
  contact,
  passenger,
  onClose,
}: Props) {
  const router = useRouter();
  const [step, setStep] = useState<"review" | "loading">("review");
  const [progress, setProgress] = useState(0);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setStep("review");
      setProgress(0);
    }
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle confirm click -> start loading animation & navigate after ~1.8s
  function handleConfirm() {
    setStep("loading");

    // Save contact & passenger data to sessionStorage
    try {
      sessionStorage.setItem(
        BOOKING_PASSENGER_KEY,
        JSON.stringify({ contact, passenger })
      );
    } catch {
      // ignore sessionStorage errors in private quirks
    }

    // Animate progress bar from 0 to 100 over ~1600ms
    const startTime = Date.now();
    const duration = 1600;
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
      }
    }, 50);

    // Navigate after 1800ms
    setTimeout(() => {
      router.push("/flights/payment");
    }, 1800);
  }

  if (!isOpen) return null;

  // ── Step 2: Fullscreen Loading Transition ──
  if (step === "loading") {
    return (
      <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <span className="material-symbols-outlined text-primary text-5xl animate-bounce">
              flight_takeoff
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center shadow-md animate-spin">
            <span className="material-symbols-outlined text-[18px]">sync</span>
          </div>
        </div>

        <h2 className="text-headline-md font-headline-md font-bold text-on-surface mb-2">
          Mengamankan kursi Anda...
        </h2>
        <p className="text-body-md font-body-md text-on-surface-variant max-w-sm mb-8">
          Mencari dan menahan kursi terbaik untuk penerbangan Anda. Mohon tidak menutup halaman ini.
        </p>

        {/* Progress Bar Container */}
        <div className="w-full max-w-xs bg-surface-container-high rounded-full h-2.5 overflow-hidden p-0.5 shadow-inner">
          <div
            className="bg-primary h-full rounded-full transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-label-sm font-label-sm text-on-surface-variant mt-2.5 tabular-nums font-semibold">
          {progress}%
        </span>
      </div>
    );
  }

  // ── Step 1: Review Passenger Details Modal ──
  const fullName = `${passenger.firstName} ${
    passenger.noLastName ? "" : passenger.lastName
  }`.trim();
  const dobMonthIdx = parseInt(passenger.dobMonth, 10) - 1;
  const dobStr =
    passenger.dobDay && !isNaN(dobMonthIdx)
      ? `${passenger.dobDay} ${MONTHS[dobMonthIdx] || ""} ${passenger.dobYear}`
      : "—";
  const natObj = NATIONALITIES.find((n) => n.code === passenger.nationality);
  const natStr = natObj ? natObj.label : passenger.nationality || "—";
  const genderStr =
    passenger.gender === "male"
      ? "Laki-laki (Tuan / Mr.)"
      : passenger.gender === "female"
      ? "Perempuan (Nyonya/Nona / Mrs./Ms.)"
      : "—";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Review Data Penumpang"
    >
      <div className="bg-surface-container-lowest w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-[0px_24px_64px_-8px_rgba(15,23,42,0.35)] overflow-hidden flex flex-col max-h-[92dvh] animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-250">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant bg-surface-container-low/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-[22px]">
                fact_check
              </span>
            </div>
            <div>
              <h2 className="text-label-md font-label-md font-bold text-on-surface">
                Review Data Penumpang
              </h2>
              <p className="text-[11px] text-on-surface-variant">
                Langkah konfirmasi sebelum ke pembayaran
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Sub-text warning */}
          <p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed">
            Pastikan ejaan dan urutan nama sudah benar sesuai paspor atau KTP.
            Kesalahan dapat menyebabkan penolakan boarding atau biaya tambahan dari maskapai.
          </p>

          {/* Yellow warning banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 text-amber-900 shadow-sm">
            <span className="material-symbols-outlined text-amber-600 text-[20px] shrink-0 mt-0.5">
              warning
            </span>
            <div className="text-[12px] leading-relaxed">
              <span className="font-bold">Perhatian Maskapai:</span> Maskapai mungkin tidak
              mengizinkan koreksi nama setelah pemesanan tiket diproses.
            </div>
          </div>

          {/* Passenger Data Card Summary */}
          <div className="bg-surface-container/60 rounded-xl border border-outline-variant/60 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/50">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">person</span>
                Penumpang 1 (Dewasa)
              </span>
              <span className="text-[11px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-md">
                Utama
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <div className="text-[11px] text-on-surface-variant font-medium">Nama Lengkap</div>
                <div className="text-label-md font-label-md font-bold text-on-surface mt-0.5 break-words">
                  {fullName || "—"}
                </div>
              </div>

              <div>
                <div className="text-[11px] text-on-surface-variant font-medium">Jenis Kelamin</div>
                <div className="text-body-sm font-body-sm text-on-surface font-semibold mt-0.5">
                  {genderStr}
                </div>
              </div>

              <div>
                <div className="text-[11px] text-on-surface-variant font-medium">Tanggal Lahir</div>
                <div className="text-body-sm font-body-sm text-on-surface font-semibold mt-0.5">
                  {dobStr}
                </div>
              </div>

              <div>
                <div className="text-[11px] text-on-surface-variant font-medium">Kebangsaan</div>
                <div className="text-body-sm font-body-sm text-on-surface font-semibold mt-0.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                    public
                  </span>
                  {natStr}
                </div>
              </div>
            </div>
          </div>

          {/* Contact summary snippet */}
          <div className="text-[12px] text-on-surface-variant bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-3 flex items-center justify-between">
            <span className="truncate">
              📧 <span className="font-semibold text-on-surface">{contact.email}</span>
            </span>
            <span className="truncate ml-2">
              📱 <span className="font-semibold text-on-surface">{contact.phoneCode}{contact.phone}</span>
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-outline-variant bg-surface-container-low/30 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface hover:border-primary hover:bg-primary/5 hover:text-primary font-label-md text-label-md font-semibold transition-all duration-200 flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Edit Data
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-surface-tint active:scale-95 font-label-md text-label-md font-bold transition-all duration-200 shadow-[0px_4px_12px_-2px_rgba(0,101,145,0.35)] flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            Confirm &amp; Lanjut
          </button>
        </div>
      </div>
    </div>
  );
}
