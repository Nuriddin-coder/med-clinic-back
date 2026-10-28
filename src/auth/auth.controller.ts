import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@ApiTags('Avtorizatsiya (Auth)')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Yangi foydalanuvchini (admin) username orqali ro‘yxatdan o‘tkazish' })
  @ApiResponse({ status: 201, description: 'Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi' })
  @ApiResponse({ status: 409, description: 'Username allaqachon band' })
  async register(@Body() dto: AuthDto) {
    return this.authService.register(dto.username, dto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Username va parol orqali tizimga kirish hamda JWT token olish' })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli kirish va JWT access_token' })
  @ApiResponse({ status: 401, description: 'Username yoki parol noto‘g‘ri' })
  async login(@Body() dto: AuthDto) {
    return this.authService.login(dto.username, dto.password);
  }
}
