import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      // Fallback ke string statis hanya untuk development.
      // Di production, JWT_SECRET WAJIB di-set di environment variable.
      secret: process.env.JWT_SECRET ?? 'tiketin_dev_secret',
      signOptions: {
        expiresIn: '7d', // Token berlaku 7 hari
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  // Export JwtModule & PassportModule agar bisa dipakai di module lain
  // ketika menerapkan @UseGuards(AuthGuard('jwt')) ke endpoints booking nanti
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
