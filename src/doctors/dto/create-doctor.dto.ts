import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import type { DoctorReview, DoctorSchedule } from '../../common/interfaces/clinic.interface';

export class CreateDoctorDto {
  @ApiPropertyOptional({ example: 'doc-new-1', description: 'Shifokor ID si (ixtiyoriy, kiritilmasa avtomatik generatsiya qilinadi)' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: 'Dr. Sardor Ikromov', description: 'Shifokor to‘liq ismi' })
  @IsString()
  @IsNotEmpty({ message: 'Shifokor ismi kiritilishi shart' })
  fullName: string;

  @ApiProperty({ example: ['sp-therapy'], description: 'Mutaxassislik ID lari' })
  @IsArray({ message: 'specialtyIds massiv bo‘lishi kerak' })
  specialtyIds: string[];

  @ApiProperty({ example: 'Terapevt-gastroenterolog', description: 'Unvon/lavozim' })
  @IsString()
  @IsNotEmpty({ message: 'Unvon kiritilishi shart' })
  title: string;

  @ApiProperty({ example: 10, description: 'Tajriba yillari' })
  @IsInt()
  @Min(0)
  experienceYears: number;

  @ApiProperty({ example: 180000, description: 'Konsultatsiya narxi (so‘mda)' })
  @IsInt()
  @Min(0)
  consultationPrice: number;

  @ApiProperty({ example: '10 yillik tajribaga ega umumiy amaliyot shifokori...', description: 'Biografiya' })
  @IsString()
  @IsNotEmpty({ message: 'Bio kiritilishi shart' })
  bio: string;

  @ApiPropertyOptional({ example: ['Toshkent Tibbiyot Akademiyasi (2014)'], description: 'Ta’lim muassasalari' })
  @IsOptional()
  @IsArray()
  education?: string[];

  @ApiPropertyOptional({ example: ['O‘zbek', 'Rus'], description: 'Qaysi tillarda muloqot qiladi' })
  @IsOptional()
  @IsArray()
  languages?: string[];

  @ApiProperty({ example: 'male', enum: ['male', 'female'], description: 'Jinsi' })
  @IsIn(['male', 'female'], { message: 'gender faqat male yoki female bo‘lishi mumkin' })
  gender: 'male' | 'female';

  @ApiPropertyOptional({ example: 'SI', description: 'Avatar bosh harflari (2 ta harf)' })
  @IsOptional()
  @IsString()
  photoInitials?: string;

  @ApiPropertyOptional({ example: 215, description: 'Avatar rangi (0-360)' })
  @IsOptional()
  @IsInt()
  photoHue?: number;

  @ApiPropertyOptional({ example: 5.0, description: 'Reyting' })
  @IsOptional()
  @IsNumber()
  rating?: number;

  @ApiPropertyOptional({ example: 0, description: 'Sharhlar soni' })
  @IsOptional()
  @IsInt()
  reviewCount?: number;

  @ApiPropertyOptional({
    description: 'Haftalik ish jadvali',
    example: {
      monday: { start: '09:00', end: '17:00' },
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: { start: '09:00', end: '13:00' },
      thursday: { start: '09:00', end: '17:00' },
      friday: { start: '09:00', end: '17:00' },
      saturday: { start: '09:00', end: '13:00' },
      sunday: null,
    },
  })
  @IsOptional()
  schedule?: DoctorSchedule;

  @ApiPropertyOptional({ description: 'Sharhlar ro‘yxati' })
  @IsOptional()
  @IsArray()
  reviews?: DoctorReview[];
}
