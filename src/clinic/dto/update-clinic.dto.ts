import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEmail, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateClinicDto {
  @ApiPropertyOptional({ example: 'MED Clinic', description: 'Klinika nomi' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Onlayn yozilish. Tirik navbatsiz qabul.', description: 'Klinika shiori' })
  @IsOptional()
  @IsString()
  tagline?: string;

  @ApiPropertyOptional({ example: 'MED Clinic — zamonaviy tibbiyot markazi...', description: 'Klinika haqida' })
  @IsOptional()
  @IsString()
  about?: string;

  @ApiPropertyOptional({ example: 'Toshkent shahar, Yunusobod tumani...', description: 'Manzil' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: ['+998712000808', '+998901234567'], description: 'Telefon raqamlar ro‘yxati' })
  @IsOptional()
  @IsArray()
  phones?: string[];

  @ApiPropertyOptional({ example: 'info@medclinic.uz', description: 'Elektron pochta' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'Dushanba–Shanba 08:00–20:00, Yakshanba — dam olish', description: 'Ish vaqti tavsifi' })
  @IsOptional()
  @IsString()
  workingHoursLabel?: string;

  @ApiPropertyOptional({ example: 12, description: 'Tajriba yillari' })
  @IsOptional()
  @IsInt()
  @Min(0)
  years?: number;

  @ApiPropertyOptional({ example: 18400, description: 'Davolangan bemorlar soni' })
  @IsOptional()
  @IsInt()
  @Min(0)
  patientCount?: number;

  @ApiPropertyOptional({ example: 10, description: 'Shifokorlar soni' })
  @IsOptional()
  @IsInt()
  @Min(0)
  doctorCount?: number;
}

