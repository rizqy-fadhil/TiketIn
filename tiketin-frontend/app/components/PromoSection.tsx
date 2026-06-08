import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const MOCK_PROMOS = [
  {
    id: 1,
    title: 'Liburan Hemat ke Bali',
    description: 'Nikmati potongan harga spesial untuk penerbangan dan hotel di Bali.',
    image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2070&auto=format&fit=crop',
    tag: 'Diskon 20%',
    tagColor: 'bg-orange-500',
    link: '#'
  },
  {
    id: 2,
    title: 'Terbang Nyaman, Dompet Aman',
    description: 'Dapatkan cashback hingga Rp 500.000 untuk transaksi pertama.',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop',
    tag: 'Cashback',
    tagColor: 'bg-blue-500',
    link: '#'
  },
  {
    id: 3,
    title: 'Staycation Seru Keluarga',
    description: 'Paket bundling tiket pesawat & hotel bintang 4, ekstra murah.',
    image: 'https://images.unsplash.com/photo-1542314831-c53cd4b85ca4?q=80&w=2070&auto=format&fit=crop',
    tag: 'Paket Bundling',
    tagColor: 'bg-teal-500',
    link: '#'
  }
];

export default function PromoSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0A1B3B]">Promo Populer</h2>
          <p className="text-gray-500 mt-2">Dapatkan penawaran terbaik untuk perjalanan Anda</p>
        </div>
        <Link href="#" className="hidden sm:flex items-center text-[#0A1B3B] font-semibold hover:underline">
          Lihat Semua Promo
          <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {MOCK_PROMOS.map((promo) => (
          <div key={promo.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-100 flex flex-col">
            {/* Image Container */}
            <div className="relative h-48 w-full">
              <Image 
                src={promo.image} 
                alt={promo.title}
                fill
                className="object-cover"
              />
              {/* Tag */}
              <div className={`absolute top-4 left-4 ${promo.tagColor} text-white text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wide`}>
                {promo.tag}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{promo.title}</h3>
              <p className="text-gray-600 text-sm mb-6 flex-grow">{promo.description}</p>
              
              <Link href={promo.link} className="inline-block mt-auto">
                <span className="text-[#0A1B3B] font-bold text-sm hover:underline">
                  Gunakan Promo
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Link */}
      <div className="mt-8 text-center sm:hidden">
        <Link href="#" className="inline-flex items-center text-[#0A1B3B] font-semibold hover:underline">
          Lihat Semua Promo
          <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
    </section>
  );
}
