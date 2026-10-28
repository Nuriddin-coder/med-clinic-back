import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private db: DatabaseService,
    ) { }

    async login(email: string, pass: string) {
        // Bazadan foydalanuvchini qidirish
        const result = await this.db.sql`SELECT * FROM users WHERE email = ${email}`;
        const user = result[0];

        if (!user) {
            throw new UnauthorizedException('Email yoki parol noto\'g\'ri');
        }

        // Parolni tekshirish 
        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Email yoki parol noto\'g\'ri');
        }

        // JWT token generatsiya qilish
        const payload = { sub: user.id, email: user.email };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async register(email: string, pass: string) {
        // Parolni heshlash
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(pass, saltOrRounds);

        // Foydalanuvchini bazaga saqlash
        const result = await this.db.sql`
      INSERT INTO users (email, password) 
      VALUES (${email}, ${hashedPassword}) 
      RETURNING id, email
    `;

        return { message: "Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tdi", user: result[0] };
    }
}