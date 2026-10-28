import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ example: 'Ali Valiyev', description: 'Foydalanuvchi ismi' })
  @IsString()
  @IsNotEmpty({ message: 'Ism kiritilishi shart' })
  @MinLength(3, { message: 'Ism kamida 3 ta belgidan iborat bo‘lishi kerak' })
  name: string;

  @ApiProperty({ example: '+998901234567', description: 'Telefon raqami' })
  @IsString()
  @IsNotEmpty({ message: 'Telefon raqam kiritilishi shart' })
  @Matches(/^\+998\d{9}$/, { message: 'Telefon raqami noto‘g‘ri (+998XXXXXXXXX formati talab qilinadi)' })
  phone: string;

  @ApiProperty({ example: 'ali@example.com', description: 'Elektron pochta manzili' })
  @IsString()
  @IsNotEmpty({ message: 'Email kiritilishi shart' })
  @IsEmail({}, { message: 'Email formati noto‘g‘ri' })
  email: string;

  @ApiProperty({ example: 'Assalomu alaykum, MRT tekshiruvi sizda mavjudmi?', description: 'Murojaat xabari' })
  @IsString()
  @IsNotEmpty({ message: 'Xabar matni kiritilishi shart' })
  @MinLength(10, { message: 'Xabar kamida 10 ta belgidan iborat bo‘lishi kerak' })
  @MaxLength(1000, { message: 'Xabar ko‘pi bilan 1000 ta belgidan oshmasligi kerak' })
  message: string;
}

