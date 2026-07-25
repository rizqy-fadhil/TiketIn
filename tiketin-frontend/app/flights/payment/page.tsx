import { Suspense } from "react";
import PaymentInner from "./components/PaymentInner";

export const metadata = {
  title: "TiketIn – Pembayaran",
  description: "Pilih metode pembayaran dan selesaikan pemesanan penerbangan Anda.",
};

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <span className="w-8 h-8 border-4 border-outline-variant border-t-primary rounded-full animate-spin" />
        </div>
      }
    >
      <PaymentInner />
    </Suspense>
  );
}
