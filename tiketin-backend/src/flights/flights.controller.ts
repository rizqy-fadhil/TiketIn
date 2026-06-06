import { Controller, Get } from '@nestjs/common';
import { FlightsService } from './flights.service';

@Controller('api/flights') // Ini URL endpoint-nya
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get()
  async findAll() {
    // Panggil fungsi dari service
    const flights = await this.flightsService.findAll();
    
    // Kembalikan response dengan format JSON API Contract standar industri
    return {
      status: 'success',
      message: 'Berhasil mengambil data tiket penerbangan',
      data: flights,
    };
  }
}