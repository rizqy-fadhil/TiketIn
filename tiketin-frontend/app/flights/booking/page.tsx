import { Suspense } from "react";
import BookingInner from "./components/BookingInner";

export const metadata = {
  title: "TiketIn – Detail Pemesanan",
  description: "Isi data penumpang dan konfirmasi penerbangan Anda sebelum lanjut ke pembayaran.",
};

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <span className="w-8 h-8 border-4 border-outline-variant border-t-primary rounded-full animate-spin" />
        </div>
      }
    >
      <BookingInner />
    </Suspense>
  );
}
