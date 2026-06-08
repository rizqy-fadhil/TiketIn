'use client';
import { Plane, MapPin, Calendar, Users, ArrowRightLeft, Search } from 'lucide-react';

export default function SearchBox() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-32 mb-16">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button className="flex items-center space-x-2 px-8 py-4 bg-white border-b-2 border-[#0A1B3B] text-[#0A1B3B] font-bold">
            <Plane size={20} />
            <span>Pesawat</span>
          </button>
          {/* Add more tabs here if needed (e.g., Kereta, Hotel) */}
        </div>

        {/* Form Container */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Asal */}
            <div className="md:col-span-3 border border-gray-300 rounded-lg p-3 hover:border-[#0A1B3B] transition-colors focus-within:border-[#0A1B3B] focus-within:ring-1 focus-within:ring-[#0A1B3B]">
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1 block">Asal</label>
              <div className="flex items-center space-x-2">
                <MapPin size={18} className="text-gray-400" />
                <input 
                  type="text" 
                  defaultValue="Jakarta (CGK)" 
                  className="w-full text-gray-900 font-medium focus:outline-none bg-transparent text-sm md:text-base"
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="hidden md:flex md:col-span-1 justify-center relative">
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2 absolute z-10 transition-colors shadow-sm top-1/2 -translate-y-1/2">
                <ArrowRightLeft size={16} />
              </button>
            </div>

            {/* Tujuan */}
            <div className="md:col-span-3 border border-gray-300 rounded-lg p-3 hover:border-[#0A1B3B] transition-colors focus-within:border-[#0A1B3B] focus-within:ring-1 focus-within:ring-[#0A1B3B]">
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1 block">Tujuan</label>
              <div className="flex items-center space-x-2">
                <MapPin size={18} className="text-gray-400" />
                <input 
                  type="text" 
                  defaultValue="Bali (DPS)" 
                  className="w-full text-gray-900 font-medium focus:outline-none bg-transparent text-sm md:text-base"
                />
              </div>
            </div>

            {/* Tanggal */}
            <div className="md:col-span-2 border border-gray-300 rounded-lg p-3 hover:border-[#0A1B3B] transition-colors focus-within:border-[#0A1B3B] focus-within:ring-1 focus-within:ring-[#0A1B3B]">
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1 block">Tanggal</label>
              <div className="flex items-center space-x-2">
                <Calendar size={18} className="text-gray-400" />
                <input 
                  type="text" 
                  defaultValue="15 Agu 2024" 
                  className="w-full text-gray-900 font-medium focus:outline-none bg-transparent text-sm md:text-base"
                />
              </div>
            </div>

            {/* Penumpang */}
            <div className="md:col-span-2 border border-gray-300 rounded-lg p-3 hover:border-[#0A1B3B] transition-colors focus-within:border-[#0A1B3B] focus-within:ring-1 focus-within:ring-[#0A1B3B]">
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1 block">Penumpang</label>
              <div className="flex items-center space-x-2">
                <Users size={18} className="text-gray-400" />
                <input 
                  type="text" 
                  defaultValue="1 Dewasa, 0 Anak" 
                  className="w-full text-gray-900 font-medium focus:outline-none bg-transparent text-sm md:text-base text-ellipsis whitespace-nowrap overflow-hidden"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-1 flex justify-end h-full">
              <button className="w-full md:w-auto h-full min-h-[56px] bg-[#0A1B3B] hover:bg-[#152a55] text-white rounded-lg flex items-center justify-center transition-colors shadow-md px-6">
                <Search size={24} />
                <span className="md:hidden ml-2 font-bold">Cari Tiket</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}