import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CancelAppointmentDto {
  @ApiProperty({ example: '+998901234567', description: 'Qabulga yozilgan telefon raqam' })
  @IsString()
  @IsNotEmpty({ message: 'Telefon raqam talab qilinadi' })
  @Matches(/^\+998\d{9}$/, { message: 'Telefon raqami noto‘g‘ri (+998XXXXXXXXX formati talab qilinadi)' })
  phone: string;
}

