import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { FlightsModule } from './flights/flights.module';

@Module({
  imports: [PrismaModule, FlightsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
