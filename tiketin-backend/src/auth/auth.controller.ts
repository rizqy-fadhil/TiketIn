import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthDto } from './dto/google-auth.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /api/auth/google
   *
   * Menerima Google ID Token dari frontend, memverifikasi ke server Google,
   * melakukan upsert user di database, dan mengembalikan JWT kita sendiri.
   *
   * Body: { idToken: string }
   * Response: { accessToken: string, user: { id, email, name } }
   */
  @Post('google')
  @HttpCode(HttpStatus.OK)
  async googleAuth(@Body() dto: GoogleAuthDto) {
    return this.authService.googleAuth(dto.idToken);
  }
}
