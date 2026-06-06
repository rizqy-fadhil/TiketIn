import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // Constructor kosong, biar Prisma 7 baca otomatis dari prisma.config.ts
    constructor() {
    super();
}

async onModuleInit() {
    await this.$connect();
}

async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit' as never, async () => {
        await app.close();
    });
    }
}