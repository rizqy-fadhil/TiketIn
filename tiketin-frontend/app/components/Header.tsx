import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-[#0A1B3B]">
              TiketIn
            </Link>
          </div>

          {/* Center Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="#" className="text-gray-700 hover:text-[#0A1B3B] font-medium transition-colors">
              Cari Tiket
            </Link>
            <Link href="#" className="text-gray-700 hover:text-[#0A1B3B] font-medium transition-colors">
              Promo
            </Link>
            <Link href="#" className="text-gray-700 hover:text-[#0A1B3B] font-medium transition-colors">
              Bantuan
            </Link>
          </nav>

          {/* Right Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="#" 
              className="text-[#0A1B3B] border border-[#0A1B3B] hover:bg-gray-50 font-semibold px-6 py-2 rounded-lg transition-colors"
            >
              Login
            </Link>
            <Link 
              href="#" 
              className="bg-[#0A1B3B] hover:bg-[#152a55] text-white font-semibold px-6 py-2 rounded-lg transition-colors shadow-md"
            >
              Register
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className="text-gray-600 hover:text-[#0A1B3B] focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
