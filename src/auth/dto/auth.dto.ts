import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({ example: 'test@gmail.com', description: 'Foydalanuvchi emaili' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Foydalanuvchi paroli' })
  password: string;
}