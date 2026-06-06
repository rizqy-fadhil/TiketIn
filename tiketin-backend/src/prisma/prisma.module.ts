import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Biar Prisma bisa diakses dari mana saja tanpa perlu import module berulang
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}