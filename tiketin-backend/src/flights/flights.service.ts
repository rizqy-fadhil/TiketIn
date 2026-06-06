import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FlightsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    // Mengambil semua data penerbangan dari database
    return this.prisma.flight.findMany({
      include: {
        airline: true, // Join tabel: biar data nama & logo maskapai ikut ke-fetch
      },
      orderBy: {
        departureTime: 'asc', // Urutkan dari jam berangkat paling awal
      },
    });
  }
}