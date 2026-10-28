import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private db: DatabaseService,
  ) {}

  async login(username: string, pass: string) {
    const cleanUsername = username ? username.trim().toLowerCase() : '';

    // Bazadan foydalanuvchini username bo'yicha qidirish
    const result = await this.db.sql`
      SELECT id, username, password, role 
      FROM users 
      WHERE LOWER(username) = ${cleanUsername}
      LIMIT 1
    `;
    const user = result[0];

    if (!user) {
      throw new UnauthorizedException({
        message: 'Username yoki parol noto‘g‘ri',
        error: {
          message: 'Username yoki parol noto‘g‘ri',
          code: 'INVALID_CREDENTIALS',
        },
      });
    }

    // Parolni tekshirish
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException({
        message: 'Username yoki parol noto‘g‘ri',
        error: {
          message: 'Username yoki parol noto‘g‘ri',
          code: 'INVALID_CREDENTIALS',
        },
      });
    }

    // JWT token generatsiya qilish
    const payload = { sub: user.id, username: user.username, role: user.role || 'admin' };
    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role || 'admin',
      },
    };
  }

  async register(username: string, pass: string) {
    const cleanUsername = username ? username.trim().toLowerCase() : '';

    // Username band emasligini tekshirish
    const existing = await this.db.sql`
      SELECT id FROM users 
      WHERE LOWER(username) = ${cleanUsername}
      LIMIT 1
    `;

    if (existing && existing.length > 0) {
      throw new ConflictException({
        message: 'Ushbu username band, iltimos boshqa username tanlang',
        error: {
          message: 'Ushbu username band, iltimos boshqa username tanlang',
          code: 'USERNAME_ALREADY_EXISTS',
        },
      });
    }

    // Parolni heshlash
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(pass, saltOrRounds);
    const id = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // Foydalanuvchini bazaga saqlash
    const result = await this.db.sql`
      INSERT INTO users (id, username, password, role) 
      VALUES (${id}, ${cleanUsername}, ${hashedPassword}, 'admin') 
      RETURNING id, username, role
    `;

    return {
      message: 'Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi',
      user: result[0],
    };
  }
}
