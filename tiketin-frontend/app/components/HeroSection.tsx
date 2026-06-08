export default function HeroSection() {
  return (
    <section className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop')" }}
      >
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-[#0A1B3B] opacity-30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 -mt-20">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg mb-4">
          Jelajahi Dunia Bersama TiketIn
        </h1>
        <p className="text-lg md:text-xl text-white drop-shadow-md max-w-2xl mx-auto font-medium">
          Temukan pengalaman tak terlupakan dengan harga terbaik untuk perjalanan impian Anda
        </p>
      </div>
    </section>
  );
}
