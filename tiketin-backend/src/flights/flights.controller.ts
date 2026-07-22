import { Controller, Get, Query } from '@nestjs/common';
import { FlightsService } from './flights.service';

@Controller('api/flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  /**
   * GET /api/flights/search?origin=CGK&destination=DPS&date=2025-12-01
   *
   * Fetches real-time flight offers from the Duffel API based on the
   * provided origin, destination, and departure date query parameters.
   */
  @Get('search')
  async searchFlights(
    @Query('origin') origin: string,
    @Query('destination') destination: string,
    @Query('date') date: string,
  ) {
    const offers = await this.flightsService.searchFlights(
      origin,
      destination,
      date,
    );

    return {
      status: 'success',
      message: 'Berhasil mengambil data tiket penerbangan dari Duffel API',
      data: offers,
    };
  }
}