"use client";

import Image from "next/image";
import FlightSearchWidget from "./FlightSearchWidget";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAiUBfBPwUH0I_bbc2QoMRA55YTjRkx3p0fNF8jarkkp9TK-7kKsVbMnyeM2-Gbi_trvAkF6HekoOZoRt0L_aNriod6qmShnASA5h2CIGotF96X4MT52VEInmY8ES5-dfj0VDRb_AzM-y_dM8iFEioHRXcfuGXM3E4pjmlxIc3CWThUbjNvCdseBAdjR9OzjHZ9M8l6BIDtNwArzpApPE6yO7mQd-3lwKlrkuekTk-YJS2rq31Wk4mC4pjar_63C7XhGr5IRas7MfA";

export default function HeroSection() {
  return (
    <section className="relative pt-24 pb-32 px-margin-mobile md:px-margin-desktop overflow-hidden flex flex-col items-center justify-center min-h-[600px] bg-gradient-to-b from-surface-container-high to-background">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          alt="Airplane wing over clouds"
          src={HERO_IMAGE}
          fill
          className="object-cover opacity-20"
          priority
          sizes="100vw"
        />
      </div>

      {/* Headline */}
      <div className="relative z-10 max-w-3xl text-center mb-12">
        <h1 className="text-display-lg font-display-lg text-on-surface mb-stack-md">
          Jelajahi Dunia Bersama TiketIn
        </h1>
        <p className="text-body-lg font-body-lg text-on-surface-variant">
          Temukan penerbangan terbaik dengan harga transparan dan proses booking
          yang cepat.
        </p>
      </div>

      {/* Search card — hero mode; routing handled internally via useRouter */}
      <div className="relative z-20 w-full max-w-5xl glass-panel rounded-xl p-6 md:p-8">
        <FlightSearchWidget mode="hero" />
      </div>
    </section>
  );
}
