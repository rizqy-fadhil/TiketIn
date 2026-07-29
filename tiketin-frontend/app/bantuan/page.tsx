"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

// ─── FAQ Data ─────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    id: "cancel",
    question: "Bagaimana cara membatalkan tiket yang sudah dipesan?",
    answer:
      "Untuk membatalkan tiket, masuk ke akun TiketIn kamu, buka menu 'My Booking', pilih pesanan yang ingin dibatalkan, lalu klik tombol 'Batalkan Pesanan'. Pastikan kamu membaca syarat pembatalan maskapai sebelum melanjutkan, karena setiap maskapai memiliki kebijakan yang berbeda. Pembatalan yang memenuhi syarat akan diproses dalam 3–7 hari kerja.",
  },
  {
    id: "refund",
    question: "Berapa lama proses refund setelah pembatalan?",
    answer:
      "Proses refund membutuhkan waktu 7–14 hari kerja setelah pembatalan disetujui, tergantung metode pembayaran yang kamu gunakan. Untuk kartu kredit/debit, dana akan kembali dalam 7–10 hari kerja. Untuk transfer bank, proses membutuhkan 3–5 hari kerja setelah konfirmasi dari maskapai. Kamu akan menerima email notifikasi ketika refund telah diproses.",
  },
  {
    id: "reschedule",
    question: "Apakah saya bisa reschedule penerbangan?",
    answer:
      "Ya, kamu bisa mengajukan reschedule penerbangan melalui menu 'My Booking' di akun TiketIn. Pilih pesanan yang ingin diubah jadwalnya, lalu klik 'Ubah Jadwal'. Perlu diingat bahwa reschedule tergantung kebijakan maskapai dan ketersediaan kursi, serta mungkin dikenakan biaya admin. Reschedule umumnya dapat dilakukan minimal 24 jam sebelum waktu keberangkatan.",
  },
  {
    id: "contact",
    question: "Bagaimana cara menghubungi customer service TiketIn?",
    answer:
      "Tim customer service TiketIn siap membantu kamu melalui beberapa saluran: (1) Email: support@tiketin.id — respons dalam 1×24 jam kerja. (2) Telepon: 021-5555-1234 — tersedia Senin–Jumat pukul 08.00–20.00 WIB dan Sabtu pukul 09.00–17.00 WIB. (3) Live Chat di aplikasi TiketIn — tersedia setiap hari pukul 08.00–22.00 WIB.",
  },
  {
    id: "wrongname",
    question: "Apa yang harus dilakukan jika nama di tiket salah?",
    answer:
      "Jika ada kesalahan penulisan nama di tiket (typo 1–2 karakter), segera hubungi customer service TiketIn dalam 24 jam setelah pemesanan. Bawa juga KTP/Paspor asli saat check-in sebagai dokumen pendukung. Perubahan nama besar (nama berbeda) biasanya tidak diperbolehkan dan mungkin memerlukan pembatalan dan pemesanan ulang sesuai kebijakan maskapai.",
  },
  {
    id: "eticket",
    question: "Bagaimana cara mendapatkan e-tiket setelah pembayaran?",
    answer:
      "E-tiket akan dikirimkan secara otomatis ke alamat email yang kamu daftarkan dalam 30 menit setelah pembayaran berhasil dikonfirmasi. Kamu juga bisa mengunduh e-tiket kapan saja melalui menu 'My Booking' di akun TiketIn. Pastikan email kamu aktif dan cek folder Spam jika e-tiket tidak ditemukan di Inbox.",
  },
  {
    id: "payment",
    question: "Metode pembayaran apa saja yang tersedia di TiketIn?",
    answer:
      "TiketIn menerima berbagai metode pembayaran untuk kemudahanmu: Kartu kredit/debit (Visa, Mastercard, JCB), Transfer bank (BCA, Mandiri, BNI, BRI), Dompet digital (GoPay, OVO, DANA, ShopeePay), dan Virtual Account. Semua transaksi diproses melalui sistem enkripsi SSL yang aman.",
  },
  {
    id: "baggage",
    question: "Bagaimana cara menambah bagasi setelah memesan tiket?",
    answer:
      "Kamu bisa menambah kapasitas bagasi melalui menu 'My Booking', pilih pesanan yang ingin ditambahkan bagasinya, lalu klik 'Tambah Bagasi'. Penambahan bagasi tersedia hingga 4 jam sebelum keberangkatan dan tergantung ketersediaan serta kebijakan maskapai. Harga tambahan bagasi bervariasi per maskapai dan rute penerbangan.",
  },
];

// ─── FAQ Accordion Item ───────────────────────────────────────────────────────
function FaqItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: (typeof FAQ_ITEMS)[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
        isOpen
          ? "border-primary/40 shadow-[0px_4px_16px_-4px_rgba(0,101,145,0.12)]"
          : "border-outline-variant hover:border-outline"
      } bg-surface-container-lowest`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
        aria-expanded={isOpen}
        id={`faq-btn-${faq.id}`}
        aria-controls={`faq-answer-${faq.id}`}
      >
        <span
          className={`text-body-md font-body-md font-semibold leading-snug transition-colors duration-200 ${
            isOpen ? "text-primary" : "text-on-surface"
          }`}
        >
          {faq.question}
        </span>
        <span
          className={`material-symbols-outlined shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-primary" : "text-on-surface-variant"
          }`}
          style={{ fontSize: "20px" }}
        >
          expand_more
        </span>
      </button>

      {/* Animated answer panel */}
      <div
        id={`faq-answer-${faq.id}`}
        role="region"
        aria-labelledby={`faq-btn-${faq.id}`}
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="px-5 pb-5 pt-0 border-t border-outline-variant/40">
          <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed pt-4">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BantuanPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  // Simple client-side filter by question text
  const filteredFAQs = useMemo(() => {
    if (!searchQuery.trim()) return FAQ_ITEMS;
    const q = searchQuery.toLowerCase();
    return FAQ_ITEMS.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section className="relative bg-gradient-to-br from-primary to-surface-tint overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />

          <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-24 text-center">
            <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white text-label-sm font-label-sm px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              <span className="material-symbols-outlined text-[15px]">
                support_agent
              </span>
              Siap Membantu 24/7
            </span>
            <h1 className="text-display-lg font-display-lg text-white mb-4 leading-tight">
              Pusat Bantuan
            </h1>
            <p className="text-body-lg font-body-lg text-white/80 max-w-xl mx-auto leading-relaxed mb-10">
              Ada yang bisa kami bantu? Temukan jawaban atas pertanyaan kamu di
              sini.
            </p>

            {/* Search box */}
            <div className="max-w-lg mx-auto relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
                search
              </span>
              <input
                type="search"
                id="faq-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pertanyaan..."
                className="w-full pl-12 pr-4 h-14 rounded-xl text-body-md font-body-md text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
                style={{
                  background: "var(--color-surface-container-lowest)",
                  border: "1.5px solid var(--color-outline-variant)",
                }}
              />
            </div>
          </div>
        </section>

        {/* ── FAQ Section ─────────────────────────────────────────────────── */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-16">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-headline-lg font-headline-lg text-on-surface">
                  Pertanyaan Umum
                </h2>
                {searchQuery && (
                  <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">
                    Menampilkan {filteredFAQs.length} hasil untuk &ldquo;
                    {searchQuery}&rdquo;
                  </p>
                )}
              </div>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-primary text-label-sm font-label-sm hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    close
                  </span>
                  Reset
                </button>
              )}
            </div>

            {filteredFAQs.length === 0 ? (
              <div className="text-center py-16">
                <span className="material-symbols-outlined text-outline text-5xl mb-4 block">
                  search_off
                </span>
                <p className="text-body-md font-body-md text-on-surface-variant">
                  Tidak ada hasil untuk &ldquo;{searchQuery}&rdquo;
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="mt-4 text-primary text-label-md font-label-md hover:underline"
                >
                  Tampilkan semua pertanyaan
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredFAQs.map((faq) => (
                  <FaqItem
                    key={faq.id}
                    faq={faq}
                    isOpen={openId === faq.id}
                    onToggle={() => toggle(faq.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Contact Section ──────────────────────────────────────────────── */}
        <section className="bg-surface-container-low border-t border-outline-variant/50">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-16">
            <div className="text-center mb-10">
              <h2 className="text-headline-lg font-headline-lg text-on-surface mb-2">
                Masih Ada Pertanyaan?
              </h2>
              <p className="text-body-md font-body-md text-on-surface-variant">
                Tim kami siap membantu kamu melalui beberapa saluran berikut.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {/* Email */}
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 flex flex-col items-center text-center gap-3 hover:border-outline hover:shadow-[0px_8px_20px_-4px_rgba(15,23,42,0.08)] transition-all duration-200">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    mail
                  </span>
                </div>
                <h3 className="text-label-md font-label-md text-on-surface font-bold">
                  Email
                </h3>
                <p className="text-body-sm font-body-sm text-primary font-semibold">
                  support@tiketin.id
                </p>
                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  Respons dalam 1×24 jam kerja
                </p>
              </div>

              {/* Phone */}
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 flex flex-col items-center text-center gap-3 hover:border-outline hover:shadow-[0px_8px_20px_-4px_rgba(15,23,42,0.08)] transition-all duration-200">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    call
                  </span>
                </div>
                <h3 className="text-label-md font-label-md text-on-surface font-bold">
                  Telepon
                </h3>
                <p className="text-body-sm font-body-sm text-primary font-semibold">
                  021-5555-1234
                </p>
                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  Sen–Jum 08.00–20.00 WIB
                  <br />
                  Sabtu 09.00–17.00 WIB
                </p>
              </div>

              {/* Live Chat */}
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 flex flex-col items-center text-center gap-3 hover:border-outline hover:shadow-[0px_8px_20px_-4px_rgba(15,23,42,0.08)] transition-all duration-200">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    chat
                  </span>
                </div>
                <h3 className="text-label-md font-label-md text-on-surface font-bold">
                  Live Chat
                </h3>
                <p className="text-body-sm font-body-sm text-primary font-semibold">
                  Via Aplikasi TiketIn
                </p>
                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  Setiap hari
                  <br />
                  08.00–22.00 WIB
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA promo ───────────────────────────────────────────────────── */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-outline-variant/30">
          <p className="text-body-md font-body-md text-on-surface-variant text-center md:text-left">
            Ingin lihat promo dan penawaran terbaru?
          </p>
          <Link
            href="/promo"
            className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-lg text-label-md font-label-md hover:opacity-90 active:scale-95 transition-all duration-200 shadow-[0px_4px_8px_-2px_rgba(0,101,145,0.35)] shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">
              local_offer
            </span>
            Lihat Promo
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
