import { Injectable, Logger } from '@nestjs/common';
import { Duffel } from '@duffel/api';

@Injectable()
export class FlightsService {
  private readonly duffel: Duffel;
  private readonly logger = new Logger(FlightsService.name);

  constructor() {
    this.duffel = new Duffel({
      token: process.env.DUFFEL_ACCESS_TOKEN,
    });
  }

  /**
   * Searches for available flight offers via the Duffel API.
   *
   * @param origin       IATA airport code for the departure airport (e.g. 'CGK')
   * @param destination  IATA airport code for the arrival airport  (e.g. 'DPS')
   * @param date         Departure date in ISO 8601 format           (e.g. '2025-12-01')
   * @returns            Array of Duffel offer objects
   */
  async searchFlights(origin: string, destination: string, date: string) {
    try {
      this.logger.log(
        `Searching flights: ${origin} → ${destination} on ${date}`,
      );

      const response = await this.duffel.offerRequests.create({
        slices: [
          {
            origin,
            destination,
            departure_date: date,
          } as any,
        ],
        passengers: [{ type: 'adult' }],
        cabin_class: 'economy',
      });

      return response.data.offers;
    } catch (error) {
      this.logger.error(
        `Failed to fetch flights from Duffel API: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}