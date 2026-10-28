import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@ApiTags('Avtorizatsiya (Auth)')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: "Yangi foydalanuvchini ro'yxatdan o'tkazish" })
    async register(@Body() dto: AuthDto) {
        return this.authService.register(dto.email, dto.password);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    @ApiOperation({ summary: 'Tizimga kirish va JWT token olish' })
    async login(@Body() dto: AuthDto) {
        return this.authService.login(dto.email, dto.password);
    }
}