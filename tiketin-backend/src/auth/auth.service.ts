import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  // OAuth2Client digunakan untuk memverifikasi Google ID Token secara server-side.
  // Hanya perlu CLIENT_ID, tidak perlu CLIENT_SECRET untuk operasi ini.
  private readonly googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Verifikasi Google ID Token yang dikirim dari frontend, kemudian
   * upsert user di database dan kembalikan JWT kita sendiri.
   */
  async googleAuth(idToken: string) {
    // ─── 1. Verifikasi token ke Google ────────────────────────────────────────
    // try/catch ini HANYA untuk verifikasi Google — tidak boleh menangkap error DB.
    let googlePayload: { sub: string; email: string; name: string; picture?: string };

    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.sub || !payload.email) {
        throw new Error('Payload Google tidak lengkap');
      }
      googlePayload = {
        sub: payload.sub,
        email: payload.email,
        name: payload.name ?? payload.email.split('@')[0],
        picture: payload.picture,
      };
    } catch (err) {
      // Hanya lempar UnauthorizedException untuk error verifikasi Google,
      // bukan untuk error database (yang tidak boleh tertangkap di sini).
      this.logger.warn(`Google token verification failed: ${(err as Error).message}`);
      throw new UnauthorizedException(
        'Google ID Token tidak valid atau sudah expired. Silakan login ulang.',
      );
    }

    // ─── 2. Upsert user di database ───────────────────────────────────────────
    // Error database di sini akan propagate sebagai InternalServerErrorException
    // (bukan tertangkap oleh catch Google di atas).
    let user = await this.prisma.user
      .findUnique({ where: { googleId: googlePayload.sub } })
      .catch((err: Error) => {
        this.logger.error(`Database error saat findUnique googleId: ${err.message}`);
        throw new InternalServerErrorException(
          'Tidak dapat terhubung ke database. Pastikan database server berjalan.',
        );
      });

    if (!user) {
      // Cek apakah sudah ada user dengan email yang sama (misal: daftar manual dulu)
      const existingByEmail = await this.prisma.user
        .findUnique({ where: { email: googlePayload.email } })
        .catch((err: Error) => {
          this.logger.error(`Database error saat findUnique email: ${err.message}`);
          throw new InternalServerErrorException(
            'Tidak dapat terhubung ke database. Pastikan database server berjalan.',
          );
        });

      if (existingByEmail) {
        // Link akun Google ke user yang sudah ada
        user = await this.prisma.user.update({
          where: { id: existingByEmail.id },
          data: {
            googleId: googlePayload.sub,
            authProvider: 'google',
          },
        });
      } else {
        // Buat user baru
        user = await this.prisma.user.create({
          data: {
            email: googlePayload.email,
            name: googlePayload.name,
            googleId: googlePayload.sub,
            authProvider: 'google',
            password: null, // Google user tidak punya password
          },
        });
      }
    }

    // ─── 3. Generate JWT kita sendiri ─────────────────────────────────────────
    // Token ini yang akan dipakai frontend untuk semua API call berikutnya.
    // sub = userId di database Prisma (bukan Google sub).
    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    this.logger.log(`User ${user.email} berhasil login via Google`);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}

