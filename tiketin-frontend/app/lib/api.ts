const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Airline {
  id: string;
  name: string;
  code: string;
  logo: string | null;
}

export interface Flight {
  id: string;
  airlineId: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  basePrice: number;
  airline: Airline;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export async function fetchFlights(): Promise<Flight[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/flights`, {
      // Revalidate occasionally, or use cache: 'no-store' for always fresh data
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch flights: ${response.statusText}`);
    }

    const json: ApiResponse<Flight[]> = await response.json();
    return json.data;
  } catch (error) {
    console.error('Error fetching flights:', error);
    return [];
  }
}
