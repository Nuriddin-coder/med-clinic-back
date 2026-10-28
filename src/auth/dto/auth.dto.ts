import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @ApiProperty({ example: 'admin_med', description: 'Foydalanuvchi nomi (username)' })
  @IsString({ message: 'Username matn bo‘lishi kerak' })
  @IsNotEmpty({ message: 'Username kiritilishi shart' })
  @MinLength(3, { message: 'Username kamida 3 ta belgidan iborat bo‘lishi kerak' })
  username: string;

  @ApiProperty({ example: 'password123', description: 'Foydalanuvchi maxfiy paroli' })
  @IsString({ message: 'Parol matn bo‘lishi kerak' })
  @IsNotEmpty({ message: 'Parol kiritilishi shart' })
  @MinLength(6, { message: 'Parol kamida 6 ta belgidan iborat bo‘lishi kerak' })
  password: string;
}
