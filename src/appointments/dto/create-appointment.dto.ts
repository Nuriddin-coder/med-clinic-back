import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({ example: 'doc-1', description: 'Shifokor ID si' })
  @IsString()
  @IsNotEmpty({ message: 'Shifokor ID si talab qilinadi' })
  doctorId: string;

  @ApiProperty({ example: 'srv-consult-therapy', description: 'Xizmat ID si' })
  @IsString()
  @IsNotEmpty({ message: 'Xizmat ID si talab qilinadi' })
  serviceId: string;

  @ApiProperty({ example: '2026-10-29', description: 'Qabul sanasi (YYYY-MM-DD)' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Sana formati noto‘g‘ri (YYYY-MM-DD)' })
  date: string;

  @ApiProperty({ example: '09:30', description: 'Qabul vaqti (HH:MM)' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'Vaqt formati noto‘g‘ri (HH:MM)' })
  time: string;

  @ApiProperty({ example: 'Ali Valiyev', description: 'Bemor ismi va familiyasi' })
  @IsString()
  @MinLength(3, { message: 'Ism kamida 3 ta belgidan iborat bo‘lishi kerak' })
  patientName: string;

  @ApiProperty({ example: '+998901234567', description: 'Bemor telefon raqami (+998XXXXXXXXX)' })
  @IsString()
  @Matches(/^\+998\d{9}$/, { message: 'Telefon raqami noto‘g‘ri (+998XXXXXXXXX formati talab qilinadi)' })
  patientPhone: string;

  @ApiPropertyOptional({ example: 'Bosh og‘rig‘i shikoyati', description: 'Izoh yoki shikoyat' })
  @IsOptional()
  @IsString()
  notes?: string;
}

