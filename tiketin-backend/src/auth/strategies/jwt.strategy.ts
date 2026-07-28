import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
  sub: string;   // userId (Prisma User.id)
  email: string;
}

/**
 * JwtStrategy: Memverifikasi JWT Bearer token pada setiap request terproteksi.
 *
 * Cara pakai nanti (untuk protect endpoint booking, dll):
 *   @UseGuards(AuthGuard('jwt'))
 *   @Get('my-bookings')
 *   getMyBookings(@Request() req) {
 *     // req.user = { userId, email }
 *   }
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'tiketin_dev_secret',
    });
  }

  /**
   * Dipanggil otomatis oleh Passport setelah JWT berhasil diverifikasi.
   * Return value menjadi req.user di controller.
   */
  async validate(payload: JwtPayload) {
    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Token tidak valid');
    }
    return { userId: payload.sub, email: payload.email };
  }
}
