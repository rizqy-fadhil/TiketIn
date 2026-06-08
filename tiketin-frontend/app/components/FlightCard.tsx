import Image from 'next/image';
import { Flight } from '../lib/api';

interface FlightCardProps {
  flight: Flight;
}

export default function FlightCard({ flight }: FlightCardProps) {
  const departureDate = new Date(flight.departureTime);
  const arrivalDate = new Date(flight.arrivalTime);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const flightDuration = Math.round(
    (arrivalDate.getTime() - departureDate.getTime()) / (1000 * 60)
  );
  const hours = Math.floor(flightDuration / 60);
  const minutes = flightDuration % 60;
  const durationText = `${hours}h ${minutes}m`;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col md:flex-row">
      {/* Airline Info */}
      <div className="p-5 flex items-center justify-between md:w-1/4 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-4">
          {flight.airline.logo ? (
            <div className="relative w-12 h-12 flex-shrink-0 bg-white rounded-full p-1 shadow-sm border border-gray-100 flex items-center justify-center">
              <Image
                src={flight.airline.logo}
                alt={flight.airline.name}
                width={40}
                height={40}
                className="object-contain max-h-8"
              />
            </div>
          ) : (
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
              {flight.airline.code}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{flight.airline.name}</h3>
            <p className="text-xs text-gray-500">{flight.flightNumber}</p>
          </div>
        </div>
      </div>

      {/* Flight Details */}
      <div className="p-5 flex-1 flex flex-col justify-center">
        <div className="flex justify-between items-center w-full">
          {/* Departure */}
          <div className="text-center md:text-left">
            <p className="text-2xl font-bold text-gray-900">{formatTime(departureDate)}</p>
            <p className="text-sm font-medium text-gray-700">{flight.origin}</p>
            <p className="text-xs text-gray-500 mt-1">{formatDate(departureDate)}</p>
          </div>

          {/* Duration / Route Line */}
          <div className="flex-1 px-4 flex flex-col items-center">
            <p className="text-xs text-gray-500 mb-1">{durationText}</p>
            <div className="w-full flex items-center">
              <div className="h-2 w-2 rounded-full border-2 border-blue-500 bg-white"></div>
              <div className="flex-1 h-[2px] bg-blue-200 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 bg-white px-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
              </div>
              <div className="h-2 w-2 rounded-full border-2 border-blue-500 bg-blue-500"></div>
            </div>
            <p className="text-xs text-gray-400 mt-1">Direct</p>
          </div>

          {/* Arrival */}
          <div className="text-center md:text-right">
            <p className="text-2xl font-bold text-gray-900">{formatTime(arrivalDate)}</p>
            <p className="text-sm font-medium text-gray-700">{flight.destination}</p>
            <p className="text-xs text-gray-500 mt-1">{formatDate(arrivalDate)}</p>
          </div>
        </div>
      </div>

      {/* Price and Action */}
      <div className="p-5 flex flex-row md:flex-col items-center justify-between md:justify-center md:w-1/4 border-t md:border-t-0 md:border-l border-gray-100 bg-gray-50/50">
        <div className="text-left md:text-center mb-0 md:mb-3">
          <p className="text-xs text-gray-500 mb-1">Start from</p>
          <p className="text-xl font-bold text-blue-600">{formatCurrency(flight.basePrice)}</p>
          <p className="text-xs text-gray-400">/pax</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-sm shadow-blue-200">
          Choose
        </button>
      </div>
    </div>
  );
}
