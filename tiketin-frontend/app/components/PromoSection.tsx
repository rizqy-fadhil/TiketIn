import Image from "next/image";

const PROMOS = [
  {
    id: 1,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDFBzcYm8-eoEqUkqsb0W5oj1rBrfNOl-El2v1TIeTrmYafJeRd1nz1KajwD1RYbV_a8zrC3mF9fkj0SnHhh18wrUt5oIGrzAJoBDXxL2Y_q3QApNeRnYnv3jfHRYyy-xVW7npTsLAKcw1ObHB-8NY7zk0wlWRsJtvkoYwuCalSHsxQ1jsrSAAwKpc8l3VR8PWEh-KG6VceDTEB3P0Yg5lJxEFmt1u3lQzpJF4yxee3oYHdgVZazSpIe18iL8IzkhJF1xEFZFt4b7o",
    alt: "Bali Temple",
    badge: "Diskon 20%",
    badgeClass: "bg-error text-on-error",
    categoryIcon: "flight",
    category: "Penerbangan Domestik",
    title: "Terbang ke Bali Lebih Hemat",
    description:
      "Nikmati potongan harga hingga Rp 500.000 untuk penerbangan ke Bali dengan maskapai pilihan.",
  },
  {
    id: 2,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC4tA6wQAbAXc1JYpSFwIs5YoHCDAk6WXHV8ZUvaSxS_kSDsSWMDdlrI8svkN-MxpTWwTSWmq643fAcoPUah_foaF49G8-lhYcvC42x11DCRzpUX74SiO0ZRYr9i26PcUhIyZMWAUhZG4ZQkVrTD4TIHg23ZGucDGkFwA9KQKr3MkByoVicP9ByKcK4MRd7_yE2llX9daIOkFDO4nfofv2RluxFwILi5iTHAPe5DXwGU-WFox8l1z8yJhTzSvF-OTzfSIttCiqoC6A",
    alt: "Tokyo Cityscape",
    badge: "Cashback",
    badgeClass: "bg-primary text-on-primary",
    categoryIcon: "public",
    category: "Rute Internasional",
    title: "Eksplorasi Tokyo Musim Gugur",
    description:
      "Dapatkan cashback langsung hingga Rp 1.000.000 untuk pembelian tiket pulang pergi ke Tokyo.",
  },
  {
    id: 3,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDT3sfXNpTSeG6Gf4X8a587A5JaSOjIiHqHLizjmf8vAWoDrQSh0oGxYiunHqlnluM-Wo7Xx5eYXLHOvkNFoj1oNnSG6p6tpqYTJt5MekgbSIgV32BSQZu_r97kEuAlC4KiBx1CY3Y5dCSuct9Txamg9yZbIEIzWgGOArUG-WpnfMii_VE2LeaSAzhriM1QMebwcVPy5Ldk9p02lCL7FVLsap8YXXwGJXXE23A1Q_cwtrcmZRqEZYimif8LzxnVGFvYUsn7mTn11uk",
    alt: "Luxury Resort",
    badge: "Paket Bundling",
    badgeClass: "bg-secondary text-on-secondary",
    categoryIcon: "hotel",
    category: "Tiket & Hotel",
    title: "Liburan Mewah di Lombok",
    description:
      "Booking paket penerbangan dan hotel bintang 5 di Lombok, hemat hingga 30% dari harga normal.",
  },
] as const;

export default function PromoSection() {
  return (
    <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-headline-lg font-headline-lg text-on-surface mb-2">
            Promo Populer
          </h2>
          <p className="text-body-md font-body-md text-on-surface-variant">
            Penawaran terbaik untuk perjalanan Anda selanjutnya.
          </p>
        </div>
        <button
          type="button"
          className="text-primary text-label-md font-label-md hover:underline hidden md:block"
        >
          Lihat Semua Promo
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {PROMOS.map((promo) => (
          <div
            key={promo.id}
            className="group cursor-pointer rounded-xl overflow-hidden border border-outline-variant bg-surface shadow-[0px_10px_15px_-3px_rgba(15,23,42,0.02)] hover:shadow-[0px_10px_15px_-3px_rgba(15,23,42,0.08)] transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="h-48 relative overflow-hidden bg-surface-container-high">
              <Image
                alt={promo.alt}
                src={promo.image}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div
                className={`absolute top-4 left-4 px-2 py-1 rounded text-label-sm font-label-sm ${promo.badgeClass}`}
              >
                {promo.badge}
              </div>
            </div>
            <div className="p-6">
              <div className="text-label-sm font-label-sm text-on-surface-variant mb-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">
                  {promo.categoryIcon}
                </span>{" "}
                {promo.category}
              </div>
              <h3 className="text-headline-md font-headline-md text-on-surface mb-2">
                {promo.title}
              </h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant mb-4">
                {promo.description}
              </p>
              <div className="text-primary text-label-md font-label-md group-hover:underline">
                Gunakan Promo
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="w-full mt-6 py-3 border border-outline-variant rounded-lg text-primary font-label-md text-label-md hover:bg-surface-container-low transition-colors md:hidden"
      >
        Lihat Semua Promo
      </button>
    </section>
  );
}
