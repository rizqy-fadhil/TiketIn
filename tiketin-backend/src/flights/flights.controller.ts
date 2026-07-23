import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { SearchFlightsDto } from './dto/search-flight.dto';

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
    @Query(new ValidationPipe({ transform: true })) query: SearchFlightsDto,
  ) {
    try {
      const offers = await this.flightsService.searchFlights(
        query.origin.toUpperCase(),
        query.destination.toUpperCase(),
        query.date,
      );

      return {
        status: 'success',
        message: 'Berhasil mengambil data tiket penerbangan dari Duffel API',
        data: offers,
      };
    } catch (error: any) {
      const duffelMessage =
        error?.errors?.[0]?.message ??
        error?.message ??
        'Terjadi kesalahan saat mencari penerbangan';

      return {
        status: 'error',
        message: duffelMessage,
        data: [],
      };
    }
  }
}