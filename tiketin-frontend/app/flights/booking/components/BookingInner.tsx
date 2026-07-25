"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  DuffelOffer,
  getCarrierName,
  getFlightNumber,
  getDepartingAt,
  getFinalArrivingAt,
  getOriginIata,
  getDestinationIata,
  getOriginName,
  getDestinationName,
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
} from "@/app/lib/duffelHelpers";

// ─── Session storage key ──────────────────────────────────────────────────────

export const BOOKING_OFFER_KEY = "tiketin_selected_offer";

// ─── Static data ──────────────────────────────────────────────────────────────

const PHONE_CODES = [
  { code: "+62", label: "🇮🇩 +62 Indonesia" },
  { code: "+1", label: "🇺🇸 +1 USA / Canada" },
  { code: "+44", label: "🇬🇧 +44 UK" },
  { code: "+61", label: "🇦🇺 +61 Australia" },
  { code: "+65", label: "🇸🇬 +65 Singapore" },
  { code: "+60", label: "🇲🇾 +60 Malaysia" },
  { code: "+63", label: "🇵🇭 +63 Philippines" },
  { code: "+66", label: "🇹🇭 +66 Thailand" },
  { code: "+81", label: "🇯🇵 +81 Japan" },
  { code: "+82", label: "🇰🇷 +82 South Korea" },
];

const NATIONALITIES = [
  { code: "ID", label: "Indonesia" },
  { code: "SG", label: "Singapura" },
  { code: "MY", label: "Malaysia" },
  { code: "AU", label: "Australia" },
  { code: "US", label: "Amerika Serikat" },
  { code: "GB", label: "Inggris" },
  { code: "JP", label: "Jepang" },
  { code: "KR", label: "Korea Selatan" },
  { code: "CN", label: "Tiongkok" },
  { code: "IN", label: "India" },
  { code: "NL", label: "Belanda" },
  { code: "DE", label: "Jerman" },
  { code: "FR", label: "Perancis" },
  { code: "AE", label: "Uni Emirat Arab" },
];

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

// ─── Form types ───────────────────────────────────────────────────────────────

interface ContactForm {
  fullName: string;
  phoneCode: string;
  phone: string;
  email: string;
}

interface PassengerForm {
  gender: "male" | "female" | "";
  firstName: string;
  lastName: string;
  noLastName: boolean;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  nationality: string;
}

type FieldErrors<T> = Partial<Record<keyof T, string>>;

// ─── Validation ───────────────────────────────────────────────────────────────

function validateContact(f: ContactForm): FieldErrors<ContactForm> {
  const errors: FieldErrors<ContactForm> = {};
  if (!f.fullName.trim()) errors.fullName = "Nama lengkap wajib diisi.";
  if (!f.email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
    errors.email = "Format email tidak valid.";
  }
  if (!f.phone.trim()) {
    errors.phone = "Nomor telepon wajib diisi.";
  } else if (!/^\d+$/.test(f.phone)) {
    errors.phone = "Nomor telepon hanya boleh berisi angka.";
  } else if (f.phone.length < 7 || f.phone.length > 15) {
    errors.phone = "Nomor telepon harus 7-15 digit.";
  }
  return errors;
}

function validatePassenger(
  f: PassengerForm,
  departingAt: string
): FieldErrors<PassengerForm> {
  const errors: FieldErrors<PassengerForm> = {};

  if (!f.gender) errors.gender = "Jenis kelamin wajib dipilih.";
  if (!f.firstName.trim()) errors.firstName = "Nama depan wajib diisi.";
  if (!f.noLastName && !f.lastName.trim())
    errors.lastName = "Nama belakang wajib diisi (atau centang 'Tidak memiliki nama belakang').";

  // Date of birth validation
  if (!f.dobDay || !f.dobMonth || !f.dobYear) {
    errors.dobDay = "Tanggal lahir wajib diisi lengkap.";
  } else {
    const day = parseInt(f.dobDay, 10);
    const month = parseInt(f.dobMonth, 10) - 1;
    const year = parseInt(f.dobYear, 10);
    const dob = new Date(year, month, day);

    if (
      isNaN(dob.getTime()) ||
      dob.getFullYear() !== year ||
      dob.getMonth() !== month ||
      dob.getDate() !== day
    ) {
      errors.dobDay = "Tanggal lahir tidak valid.";
    } else {
      const refDate = departingAt ? new Date(departingAt) : new Date();
      if (dob > refDate) {
        errors.dobDay = "Tanggal lahir tidak boleh di masa depan.";
      } else {
        // Adult: must be >= 12 years old on departure date
        const minDob = new Date(refDate);
        minDob.setFullYear(minDob.getFullYear() - 12);
        if (dob > minDob) {
          errors.dobDay = "Penumpang dewasa harus berusia minimal 12 tahun pada tanggal keberangkatan.";
        }
      }
    }
  }

  if (!f.nationality) errors.nationality = "Kebangsaan wajib dipilih.";
  return errors;
}

// ─── Styled input shared classes ──────────────────────────────────────────────

const inputBase =
  "w-full bg-surface-container-lowest border rounded-xl px-4 py-3 text-body-sm font-body-sm text-on-surface outline-none transition-all duration-200 placeholder:text-outline";

function fieldClass(error?: string) {
  return `${inputBase} ${
    error
      ? "border-error focus:border-error focus:ring-1 focus:ring-error/30"
      : "border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20"
  }`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-[12px] text-error">
      <span className="material-symbols-outlined text-[13px]">error</span>
      {message}
    </p>
  );
}

function SectionHeader({ icon, title, badge }: { icon: string; title: string; badge?: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant bg-surface-container-low/60">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-[20px]">{icon}</span>
        </div>
        <h2 className="text-label-md font-label-md font-bold text-on-surface">{title}</h2>
      </div>
      {badge && (
        <span className="text-[11px] font-bold text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
          {badge}
        </span>
      )}
    </div>
  );
}

// ─── Flight Summary Sidebar Card ──────────────────────────────────────────────

function FlightSummaryCard({ offer }: { offer: DuffelOffer }) {
  const [logoError, setLogoError] = useState(false);
  const logoUrl = getAirlineLogoUrl(offer);
  const carrierName = getCarrierName(offer);
  const flightNumber = getFlightNumber(offer);
  const departingAt = getDepartingAt(offer);
  const arrivingAt = getFinalArrivingAt(offer);
  const originIata = getOriginIata(offer);
  const destIata = getDestinationIata(offer);
  const originName = getOriginName(offer);
  const destName = getDestinationName(offer);
  const duration = getDuration(offer);
  const fareBrand = getFareBrandName(offer);
  const segCount = getSegmentCount(offer);
  const transitLabel = segCount <= 1 ? "Langsung" : `${segCount - 1} Transit`;
  const conditions = getOfferConditions(offer);
  const baggage = getBaggageInfo(offer);

  const changeAllowed = conditions?.change_before_departure?.allowed ?? false;
  const refundAllowed = conditions?.refund_before_departure?.allowed ?? false;

  function formatDateShort(iso: string) {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleDateString("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "";
    }
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-[0px_4px_12px_-2px_rgba(15,23,42,0.06)]">
      {/* Header */}
      <div className="px-4 py-3 bg-primary/6 border-b border-outline-variant flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-primary text-on-primary rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[10px]">flight_takeoff</span>
            Berangkat
          </span>
          <span className="text-label-sm font-label-sm font-semibold text-on-surface">
            {originIata} → {destIata}
          </span>
        </div>
        <span className="text-[11px] text-on-surface-variant">{formatDateShort(departingAt)}</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Carrier row */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
            {logoUrl && !logoError ? (
              <Image
                src={logoUrl}
                alt={`${carrierName} logo`}
                width={32}
                height={32}
                className="object-contain w-8 h-8"
                onError={() => setLogoError(true)}
                unoptimized
              />
            ) : (
              <span className="material-symbols-outlined text-primary text-lg">airlines</span>
            )}
          </div>
          <div>
            <div className="text-label-sm font-label-sm font-bold text-on-surface">{carrierName}</div>
            <div className="text-[11px] text-on-surface-variant">
              {flightNumber} · {fareBrand ?? "Economy"}
            </div>
          </div>
        </div>

        {/* Route timeline */}
        <div className="flex items-center gap-2">
          <div className="text-center shrink-0">
            <div className="text-headline-sm font-headline-sm text-on-surface tabular-nums">
              {formatTime(departingAt)}
            </div>
            <div className="text-[11px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-md mt-0.5 inline-block">
              {originIata}
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center min-w-0 px-2">
            <span className="text-[11px] text-tertiary font-semibold">{duration}</span>
            <div className="w-full flex items-center my-1">
              <div className="h-[2px] bg-outline-variant/50 flex-1 rounded-l-full" />
              <span className="material-symbols-outlined text-outline-variant text-[14px] mx-1 rotate-90">
                flight
              </span>
              <div className="h-[2px] bg-outline-variant/50 flex-1 rounded-r-full" />
            </div>
            <span className="text-[11px] text-primary font-medium">{transitLabel}</span>
          </div>
          <div className="text-center shrink-0">
            <div className="text-headline-sm font-headline-sm text-on-surface tabular-nums">
              {formatTime(arrivingAt)}
            </div>
            <div className="text-[11px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-md mt-0.5 inline-block">
              {destIata}
            </div>
          </div>
        </div>

        {/* Airport names */}
        <div className="flex justify-between text-[11px] text-on-surface-variant -mt-2">
          <span className="truncate max-w-[45%]">{originName}</span>
          <span className="truncate max-w-[45%] text-right">{destName}</span>
        </div>

        {/* Condition badges */}
        <div className="pt-1 border-t border-outline-variant/50 flex flex-wrap gap-1.5">
          {/* Baggage */}
          <span
            className={[
              "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold border",
              baggage.hasChecked
                ? "bg-tertiary/10 text-tertiary border-tertiary/20"
                : "bg-surface-container text-on-surface-variant border-outline-variant/60",
            ].join(" ")}
          >
            <span className="material-symbols-outlined text-[12px]">
              {baggage.hasChecked ? "luggage" : "do_not_luggage"}
            </span>
            {baggage.label}
          </span>

          {/* Reschedule */}
          <span
            className={[
              "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold border",
              changeAllowed
                ? "bg-tertiary/10 text-tertiary border-tertiary/20"
                : "bg-surface-container text-on-surface-variant border-outline-variant/60",
            ].join(" ")}
          >
            <span className="material-symbols-outlined text-[12px]">
              {changeAllowed ? "event_available" : "event_busy"}
            </span>
            {changeAllowed ? "Bisa Reschedule" : "Non-Reschedule"}
          </span>

          {/* Refund */}
          <span
            className={[
              "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold border",
              refundAllowed
                ? "bg-tertiary/10 text-tertiary border-tertiary/20"
                : "bg-surface-container text-on-surface-variant border-outline-variant/60",
            ].join(" ")}
          >
            <span className="material-symbols-outlined text-[12px]">
              {refundAllowed ? "payments" : "money_off"}
            </span>
            {refundAllowed ? "Refundable" : "Non-Refund"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Price Summary Card ───────────────────────────────────────────────────────

function PriceSummaryCard({ offer }: { offer: DuffelOffer }) {
  const amount = getTotalAmount(offer);
  const currency = getTotalCurrency(offer);

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-[0px_4px_12px_-2px_rgba(15,23,42,0.06)]">
      <div className="px-4 py-3 bg-surface-container-low/60 border-b border-outline-variant">
        <h3 className="text-label-sm font-label-sm font-bold text-on-surface">Rincian Harga</h3>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-body-sm font-body-sm text-on-surface-variant">
            Harga tiket (1 Dewasa)
          </span>
          <span className="text-body-sm font-body-sm text-on-surface font-semibold">
            {formatCurrency(amount, currency)}
          </span>
        </div>
        {currency !== "IDR" && (
          <p className="text-[11px] text-on-surface-variant">Mata uang: {currency}</p>
        )}
        <div className="border-t border-outline-variant/60 pt-3 flex justify-between items-center">
          <span className="text-label-sm font-label-sm font-bold text-on-surface">
            Total Pembayaran
          </span>
          <span className="text-lg font-bold text-primary">{formatCurrency(amount, currency)}</span>
        </div>
        <p className="text-[11px] text-on-surface-variant">
          * Harga sudah termasuk pajak dan biaya. Dikutip dari Duffel API.
        </p>
      </div>
    </div>
  );
}

// ─── Contact Form Section ─────────────────────────────────────────────────────

interface ContactSectionProps {
  form: ContactForm;
  errors: FieldErrors<ContactForm>;
  onChange: (f: ContactForm) => void;
  onBlur: (field: keyof ContactForm) => void;
}

function ContactSection({ form, errors, onChange, onBlur }: ContactSectionProps) {
  return (
    <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-[0px_4px_12px_-2px_rgba(15,23,42,0.03)]">
      <SectionHeader icon="contacts" title="Detail Kontak" />
      <div className="p-5 space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-label-sm font-label-sm text-on-surface mb-1.5">
            Nama Lengkap <span className="text-error">*</span>
          </label>
          <input
            id="contact-fullname"
            type="text"
            autoComplete="name"
            placeholder="Cth: Budi Santoso"
            value={form.fullName}
            onChange={(e) => onChange({ ...form, fullName: e.target.value })}
            onBlur={() => onBlur("fullName")}
            className={fieldClass(errors.fullName)}
          />
          <FieldError message={errors.fullName} />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-label-sm font-label-sm text-on-surface mb-1.5">
            Nomor Telepon <span className="text-error">*</span>
          </label>
          <div className="flex gap-2">
            <div className="relative shrink-0 w-[160px]">
              <select
                id="contact-phone-code"
                value={form.phoneCode}
                onChange={(e) => onChange({ ...form, phoneCode: e.target.value })}
                className={`${fieldClass()} appearance-none pr-7 text-[13px]`}
              >
                {PHONE_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[14px] text-outline pointer-events-none">
                expand_more
              </span>
            </div>
            <input
              id="contact-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="8123456789"
              value={form.phone}
              onChange={(e) =>
                onChange({ ...form, phone: e.target.value.replace(/\D/g, "") })
              }
              onBlur={() => onBlur("phone")}
              className={`${fieldClass(errors.phone)} flex-1`}
            />
          </div>
          <FieldError message={errors.phone} />
        </div>

        {/* Email */}
        <div>
          <label className="block text-label-sm font-label-sm text-on-surface mb-1.5">
            Alamat Email <span className="text-error">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            placeholder="contoh@email.com"
            value={form.email}
            onChange={(e) => onChange({ ...form, email: e.target.value })}
            onBlur={() => onBlur("email")}
            className={fieldClass(errors.email)}
          />
          <FieldError message={errors.email} />
          <p className="mt-1.5 text-[11px] text-on-surface-variant">
            E-tiket akan dikirim ke alamat email ini.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Passenger Form Section ───────────────────────────────────────────────────

interface PassengerSectionProps {
  form: PassengerForm;
  errors: FieldErrors<PassengerForm>;
  onChange: (f: PassengerForm) => void;
  onBlur: (field: keyof PassengerForm) => void;
}

function PassengerSection({ form, errors, onChange, onBlur }: PassengerSectionProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-[0px_4px_12px_-2px_rgba(15,23,42,0.03)]">
      <SectionHeader icon="airline_seat_recline_normal" title="Detail Penumpang 1" badge="Dewasa" />
      <div className="p-5 space-y-4">
        {/* Passport warning */}
        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-3">
          <span className="material-symbols-outlined text-amber-500 text-[18px] shrink-0 mt-0.5">
            warning
          </span>
          <p className="text-[12px] text-amber-800 leading-relaxed">
            <strong>Penting:</strong> Nama harus sesuai dengan paspor/KTP. Kesalahan penulisan dapat
            menyebabkan penolakan boarding oleh maskapai.
          </p>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-label-sm font-label-sm text-on-surface mb-2">
            Jenis Kelamin <span className="text-error">*</span>
          </label>
          <div className="flex gap-3">
            {(
              [
                { value: "male", label: "Laki-laki", icon: "man" },
                { value: "female", label: "Perempuan", icon: "woman" },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                className={[
                  "flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl border cursor-pointer transition-all duration-200 select-none",
                  form.gender === opt.value
                    ? "bg-primary/8 border-primary shadow-[0px_0px_0px_2px_rgba(0,101,145,0.15)]"
                    : "bg-surface-container-lowest border-outline-variant hover:border-primary/40 hover:bg-primary/4",
                ].join(" ")}
              >
                <input
                  type="radio"
                  name="gender"
                  value={opt.value}
                  checked={form.gender === opt.value}
                  onChange={() => onChange({ ...form, gender: opt.value })}
                  className="sr-only"
                />
                <span
                  className={[
                    "material-symbols-outlined text-[20px]",
                    form.gender === opt.value ? "text-primary" : "text-on-surface-variant",
                  ].join(" ")}
                >
                  {opt.icon}
                </span>
                <span
                  className={[
                    "text-label-sm font-label-sm font-semibold",
                    form.gender === opt.value ? "text-primary" : "text-on-surface",
                  ].join(" ")}
                >
                  {opt.label}
                </span>
                {form.gender === opt.value && (
                  <span className="material-symbols-outlined text-primary text-[16px] ml-auto">
                    check_circle
                  </span>
                )}
              </label>
            ))}
          </div>
          <FieldError message={errors.gender} />
        </div>

        {/* First name */}
        <div>
          <label className="block text-label-sm font-label-sm text-on-surface mb-1.5">
            Nama Depan &amp; Tengah <span className="text-error">*</span>
            <span className="text-[11px] text-on-surface-variant ml-1 font-normal">
              (sesuai paspor/KTP)
            </span>
          </label>
          <input
            id="pax-firstname"
            type="text"
            autoComplete="given-name"
            placeholder="Cth: Budi Eko"
            value={form.firstName}
            onChange={(e) => onChange({ ...form, firstName: e.target.value })}
            onBlur={() => onBlur("firstName")}
            className={fieldClass(errors.firstName)}
          />
          <FieldError message={errors.firstName} />
        </div>

        {/* Last name */}
        <div>
          <label className="block text-label-sm font-label-sm text-on-surface mb-1.5">
            Nama Belakang
            {!form.noLastName && <span className="text-error ml-0.5">*</span>}
            <span className="text-[11px] text-on-surface-variant ml-1 font-normal">
              (sesuai paspor/KTP)
            </span>
          </label>
          <input
            id="pax-lastname"
            type="text"
            autoComplete="family-name"
            placeholder="Cth: Santoso"
            value={form.noLastName ? "" : form.lastName}
            disabled={form.noLastName}
            onChange={(e) => onChange({ ...form, lastName: e.target.value })}
            onBlur={() => onBlur("lastName")}
            className={`${fieldClass(errors.lastName)} disabled:opacity-50 disabled:cursor-not-allowed`}
          />
          <FieldError message={errors.lastName} />
          <label className="inline-flex items-center gap-2 mt-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.noLastName}
              onChange={(e) =>
                onChange({ ...form, noLastName: e.target.checked, lastName: "" })
              }
              className="w-4 h-4 rounded border-outline-variant accent-primary"
            />
            <span className="text-[12px] text-on-surface-variant">
              Tidak memiliki nama belakang
            </span>
          </label>
        </div>

        {/* Date of birth */}
        <div>
          <label className="block text-label-sm font-label-sm text-on-surface mb-1.5">
            Tanggal Lahir <span className="text-error">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {/* Day */}
            <div className="relative">
              <select
                id="pax-dob-day"
                value={form.dobDay}
                onChange={(e) => onChange({ ...form, dobDay: e.target.value })}
                onBlur={() => onBlur("dobDay")}
                className={`${fieldClass(errors.dobDay)} appearance-none pr-7`}
              >
                <option value="">Tanggal</option>
                {days.map((d) => (
                  <option key={d} value={String(d)}>
                    {d}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[14px] text-outline pointer-events-none">
                expand_more
              </span>
            </div>
            {/* Month */}
            <div className="relative">
              <select
                id="pax-dob-month"
                value={form.dobMonth}
                onChange={(e) => onChange({ ...form, dobMonth: e.target.value })}
                onBlur={() => onBlur("dobDay")}
                className={`${fieldClass(errors.dobDay)} appearance-none pr-7`}
              >
                <option value="">Bulan</option>
                {MONTHS.map((m, i) => (
                  <option key={m} value={String(i + 1)}>
                    {m}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[14px] text-outline pointer-events-none">
                expand_more
              </span>
            </div>
            {/* Year */}
            <div className="relative">
              <select
                id="pax-dob-year"
                value={form.dobYear}
                onChange={(e) => onChange({ ...form, dobYear: e.target.value })}
                onBlur={() => onBlur("dobDay")}
                className={`${fieldClass(errors.dobDay)} appearance-none pr-7`}
              >
                <option value="">Tahun</option>
                {years.map((y) => (
                  <option key={y} value={String(y)}>
                    {y}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[14px] text-outline pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
          <FieldError message={errors.dobDay} />
        </div>

        {/* Nationality */}
        <div>
          <label className="block text-label-sm font-label-sm text-on-surface mb-1.5">
            Kebangsaan <span className="text-error">*</span>
          </label>
          <div className="relative">
            <select
              id="pax-nationality"
              value={form.nationality}
              onChange={(e) => onChange({ ...form, nationality: e.target.value })}
              onBlur={() => onBlur("nationality")}
              className={`${fieldClass(errors.nationality)} appearance-none pr-7`}
            >
              <option value="">Pilih kebangsaan</option>
              {NATIONALITIES.map((n) => (
                <option key={n.code} value={n.code}>
                  {n.label}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[14px] text-outline pointer-events-none">
              expand_more
            </span>
          </div>
          <FieldError message={errors.nationality} />
        </div>
      </div>
    </section>
  );
}

// ─── Mobile summary bar (collapsible) ────────────────────────────────────────

function MobileSummaryBar({ offer, open, onToggle }: { offer: DuffelOffer; open: boolean; onToggle: () => void }) {
  const originIata = getOriginIata(offer);
  const destIata = getDestinationIata(offer);
  const amount = getTotalAmount(offer);
  const currency = getTotalCurrency(offer);
  const departingAt = getDepartingAt(offer);

  function formatDateShort(iso: string) {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    } catch {
      return "";
    }
  }

  return (
    <div className="lg:hidden bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-[0px_4px_12px_-2px_rgba(15,23,42,0.06)] mb-4">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-[18px]">flight_takeoff</span>
          <div>
            <div className="text-label-sm font-label-sm font-bold text-on-surface">
              {originIata} → {destIata}
            </div>
            <div className="text-[11px] text-on-surface-variant">{formatDateShort(departingAt)}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-label-sm font-label-sm font-bold text-primary">
            {formatCurrency(amount, currency)}
          </span>
          <span
            className={[
              "material-symbols-outlined text-outline text-[20px] transition-transform duration-200",
              open ? "rotate-180" : "",
            ].join(" ")}
          >
            expand_more
          </span>
        </div>
      </button>
      {open && (
        <div className="border-t border-outline-variant px-4 pb-4 pt-3 space-y-3">
          <FlightSummaryCard offer={offer} />
          <PriceSummaryCard offer={offer} />
        </div>
      )}
    </div>
  );
}

// ─── Main BookingInner Component ──────────────────────────────────────────────

export default function BookingInner() {
  const router = useRouter();
  const [offer, setOffer] = useState<DuffelOffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // ── Contact form state ──────────────────────────────────────────────────────
  const [contact, setContact] = useState<ContactForm>({
    fullName: "",
    phoneCode: "+62",
    phone: "",
    email: "",
  });
  const [contactErrors, setContactErrors] = useState<FieldErrors<ContactForm>>({});
  const [contactTouched, setContactTouched] = useState<Partial<Record<keyof ContactForm, boolean>>>({});

  // ── Passenger form state ────────────────────────────────────────────────────
  const [passenger, setPassenger] = useState<PassengerForm>({
    gender: "",
    firstName: "",
    lastName: "",
    noLastName: false,
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    nationality: "ID",
  });
  const [passengerErrors, setPassengerErrors] = useState<FieldErrors<PassengerForm>>({});
  const [passengerTouched, setPassengerTouched] = useState<
    Partial<Record<keyof PassengerForm, boolean>>
  >({});

  // ── Read offer from sessionStorage on mount ─────────────────────────────────
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(BOOKING_OFFER_KEY);
      if (!raw) {
        // No offer in session — redirect back to search with message
        router.replace(
          "/flights/search?notice=Silakan+pilih+penerbangan+terlebih+dahulu."
        );
        return;
      }
      const parsed = JSON.parse(raw) as DuffelOffer;
      if (!parsed?.id) throw new Error("invalid offer");
      setOffer(parsed);
    } catch {
      router.replace(
        "/flights/search?notice=Sesi+pemesanan+tidak+valid.+Silakan+cari+penerbangan+kembali."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  // ── Derived validation ──────────────────────────────────────────────────────
  function runContactValidation(form: ContactForm) {
    const errs = validateContact(form);
    setContactErrors(errs);
    return errs;
  }

  function runPassengerValidation(form: PassengerForm) {
    const depAt = offer ? getDepartingAt(offer) : "";
    const errs = validatePassenger(form, depAt);
    setPassengerErrors(errs);
    return errs;
  }

  // Blur handlers — validate only touched fields
  function handleContactBlur(field: keyof ContactForm) {
    setContactTouched((t) => ({ ...t, [field]: true }));
    const errs = validateContact(contact);
    setContactErrors((prev) => ({ ...prev, [field]: errs[field] }));
  }

  function handlePassengerBlur(field: keyof PassengerForm) {
    setPassengerTouched((t) => ({ ...t, [field]: true }));
    const depAt = offer ? getDepartingAt(offer) : "";
    const errs = validatePassenger(passenger, depAt);
    setPassengerErrors((prev) => ({ ...prev, [field]: errs[field] }));
  }

  // Whether all required fields are filled (loose check for disabled state)
  const isFormReadyToSubmit =
    contact.fullName.trim() &&
    contact.email.trim() &&
    contact.phone.trim() &&
    passenger.gender &&
    passenger.firstName.trim() &&
    (passenger.noLastName || passenger.lastName.trim()) &&
    passenger.dobDay &&
    passenger.dobMonth &&
    passenger.dobYear &&
    passenger.nationality;

  // ── Submit ──────────────────────────────────────────────────────────────────
  function handleSubmit() {
    setSubmitted(true);
    // Mark all fields as touched to show all errors
    setContactTouched({ fullName: true, email: true, phone: true, phoneCode: true });
    setPassengerTouched({
      gender: true,
      firstName: true,
      lastName: true,
      dobDay: true,
      dobMonth: true,
      dobYear: true,
      nationality: true,
    });

    const cErrors = runContactValidation(contact);
    const pErrors = runPassengerValidation(passenger);

    const hasErrors =
      Object.keys(cErrors).length > 0 || Object.keys(pErrors).length > 0;

    if (hasErrors) {
      // Scroll to first error
      const firstError = document.querySelector("[data-error]");
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // All valid — log data (Payment page not yet implemented)
    const bookingPayload = {
      offer: offer,
      contact,
      passenger,
      submittedAt: new Date().toISOString(),
    };
    console.log("[TiketIn Booking] Payload:", bookingPayload);

    // Show toast
    setToast("Data tersimpan! Halaman pembayaran belum tersedia — akan segera hadir.");
    setTimeout(() => setToast(null), 5000);
  }

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-outline-variant border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!offer) return null;

  const departingAt = getDepartingAt(offer);

  // Compute errors only for touched fields
  const displayContactErrors: FieldErrors<ContactForm> = {};
  if (contactTouched.fullName) displayContactErrors.fullName = contactErrors.fullName;
  if (contactTouched.email) displayContactErrors.email = contactErrors.email;
  if (contactTouched.phone) displayContactErrors.phone = contactErrors.phone;

  const displayPaxErrors: FieldErrors<PassengerForm> = {};
  if (passengerTouched.gender) displayPaxErrors.gender = passengerErrors.gender;
  if (passengerTouched.firstName) displayPaxErrors.firstName = passengerErrors.firstName;
  if (passengerTouched.lastName) displayPaxErrors.lastName = passengerErrors.lastName;
  if (passengerTouched.dobDay) displayPaxErrors.dobDay = passengerErrors.dobDay;
  if (passengerTouched.nationality) displayPaxErrors.nationality = passengerErrors.nationality;

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-sans antialiased">
      {/* ── Nav ── */}
      <nav className="bg-surface sticky top-0 z-50 border-b border-outline-variant shadow-sm">
        <div className="flex justify-between items-center w-full px-4 md:px-margin-desktop max-w-container-max mx-auto h-16">
          <Link
            href="/"
            className="text-headline-md font-headline-md font-bold text-primary tracking-tight"
          >
            TiketIn
          </Link>
          <div className="hidden md:flex space-x-gutter h-full items-center pt-2">
            <Link
              href="/flights/search"
              className="text-on-surface-variant hover:text-primary transition-colors duration-200 text-label-md font-label-md pb-[6px]"
            >
              Cari Tiket
            </Link>
            <Link
              href="#"
              className="text-on-surface-variant hover:text-primary transition-colors duration-200 text-label-md font-label-md pb-[6px]"
            >
              Bantuan
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {/* Back to search */}
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-1 text-on-surface-variant hover:text-primary text-label-sm font-label-sm transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span className="hidden sm:inline">Kembali</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-container-max w-full mx-auto px-4 md:px-margin-desktop py-6 pb-28 lg:pb-8">
        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-headline-md font-headline-md text-on-surface">Detail Pemesanan</h1>
          <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">
            Pastikan data yang diisi sesuai dengan paspor/KTP Anda.
          </p>
        </div>

        {/* Mobile collapsible summary */}
        <MobileSummaryBar
          offer={offer}
          open={summaryOpen}
          onToggle={() => setSummaryOpen((o) => !o)}
        />

        {/* Two-column layout */}
        <div className="flex gap-6 items-start">
          {/* ── Left column: forms ── */}
          <div className="flex-1 min-w-0 space-y-5">
            <ContactSection
              form={contact}
              errors={displayContactErrors}
              onChange={(f) => {
                setContact(f);
                // Re-validate touched fields live
                if (contactTouched.fullName || contactTouched.email || contactTouched.phone) {
                  runContactValidation(f);
                }
              }}
              onBlur={handleContactBlur}
            />

            <PassengerSection
              form={passenger}
              errors={displayPaxErrors}
              onChange={(f) => {
                setPassenger(f);
                if (Object.values(passengerTouched).some(Boolean)) {
                  runPassengerValidation(f);
                }
              }}
              onBlur={handlePassengerBlur}
            />

            {/* Desktop submit button (inside form column, under lg:hidden) */}
            <div className="hidden lg:block">
              <SubmitButton
                disabled={!isFormReadyToSubmit}
                submitted={submitted}
                contactErrors={contactErrors}
                passengerErrors={passengerErrors}
                onClick={handleSubmit}
              />
            </div>
          </div>

          {/* ── Right column: sticky sidebar ── */}
          <aside className="hidden lg:flex w-72 xl:w-80 shrink-0 flex-col gap-4 sticky top-[76px]">
            <FlightSummaryCard offer={offer} />
            <PriceSummaryCard offer={offer} />
          </aside>
        </div>
      </main>

      {/* ── Mobile sticky bottom bar ── */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface-container-lowest border-t border-outline-variant px-4 py-3 shadow-[0px_-4px_12px_-2px_rgba(15,23,42,0.10)]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-on-surface-variant">Total Pembayaran</span>
          <span className="text-label-md font-label-md font-bold text-primary">
            {formatCurrency(getTotalAmount(offer), getTotalCurrency(offer))}
          </span>
        </div>
        <SubmitButton
          disabled={!isFormReadyToSubmit}
          submitted={submitted}
          contactErrors={contactErrors}
          passengerErrors={passengerErrors}
          onClick={handleSubmit}
        />
      </div>

      {/* ── Toast notification ── */}
      {toast && (
        <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-on-surface text-surface-container-lowest text-[13px] font-semibold px-5 py-3 rounded-xl shadow-[0px_8px_24px_-4px_rgba(15,23,42,0.25)] max-w-sm w-[90vw] text-center flex items-start gap-2">
          <span className="material-symbols-outlined text-[16px] shrink-0 text-tertiary mt-0.5">
            check_circle
          </span>
          {toast}
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant mt-auto w-full py-stack-lg px-4 md:px-margin-desktop max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-4 hidden lg:flex">
        <div className="text-headline-sm font-headline-sm font-bold text-on-surface">TiketIn</div>
        <div className="flex flex-wrap justify-center gap-stack-md">
          {["Tentang Kami", "Pusat Bantuan", "Syarat & Ketentuan", "Kebijakan Privasi"].map(
            (label) => (
              <Link
                key={label}
                href="#"
                className="text-on-surface-variant text-label-sm font-label-sm hover:underline hover:text-primary transition-colors"
              >
                {label}
              </Link>
            )
          )}
        </div>
        <div className="text-body-sm font-body-sm text-on-surface-variant">
          © 2024 TiketIn. Solusi Perjalanan Modern.
        </div>
      </footer>
    </div>
  );
}

// ─── Submit Button (shared between desktop + mobile) ──────────────────────────

function SubmitButton({
  disabled,
  submitted,
  contactErrors,
  passengerErrors,
  onClick,
}: {
  disabled: boolean;
  submitted: boolean;
  contactErrors: FieldErrors<ContactForm>;
  passengerErrors: FieldErrors<PassengerForm>;
  onClick: () => void;
}) {
  const hasErrors =
    submitted &&
    (Object.keys(contactErrors).length > 0 || Object.keys(passengerErrors).length > 0);

  return (
    <div>
      <button
        type="button"
        disabled={false} /* always clickable so we can show validation errors */
        onClick={onClick}
        className={[
          "w-full py-3.5 rounded-xl text-label-md font-label-md font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-[0px_4px_8px_-2px_rgba(0,101,145,0.35)]",
          disabled
            ? "bg-outline-variant text-on-surface-variant cursor-not-allowed shadow-none"
            : "bg-primary text-on-primary hover:bg-surface-tint active:scale-[0.98]",
        ].join(" ")}
      >
        <span className="material-symbols-outlined text-[18px]">
          {disabled ? "lock" : "payment"}
        </span>
        Lanjut ke Pembayaran
      </button>
      {hasErrors && (
        <p className="mt-2 text-[12px] text-error text-center flex items-center justify-center gap-1">
          <span className="material-symbols-outlined text-[13px]">error</span>
          Mohon perbaiki field yang belum terisi dengan benar.
        </p>
      )}
      {disabled && !hasErrors && (
        <p className="mt-2 text-[11px] text-on-surface-variant text-center">
          Lengkapi semua field yang diperlukan untuk melanjutkan.
        </p>
      )}
    </div>
  );
}
