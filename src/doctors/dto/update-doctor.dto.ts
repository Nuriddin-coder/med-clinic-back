import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import type { DoctorReview, DoctorSchedule } from '../../common/interfaces/clinic.interface';

export class UpdateDoctorDto {
  @ApiPropertyOptional({ example: 'Dr. Anvar Karimov', description: 'Shifokor to‘liq ismi' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ example: ['sp-therapy'], description: 'Mutaxassislik ID lari' })
  @IsOptional()
  @IsArray()
  specialtyIds?: string[];

  @ApiPropertyOptional({ example: 'Terapevt, oliy toifali shifokor', description: 'Unvon/lavozim' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 15, description: 'Tajriba yillari' })
  @IsOptional()
  @IsInt()
  @Min(0)
  experienceYears?: number;

  @ApiPropertyOptional({ example: 200000, description: 'Konsultatsiya narxi (so‘mda)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  consultationPrice?: number;

  @ApiPropertyOptional({ example: 'Yangilangan bio...', description: 'Biografiya' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ example: ['Toshkent Tibbiyot Akademiyasi'], description: 'Ta’lim muassasalari' })
  @IsOptional()
  @IsArray()
  education?: string[];

  @ApiPropertyOptional({ example: ['O‘zbek', 'Rus'], description: 'Tillar' })
  @IsOptional()
  @IsArray()
  languages?: string[];

  @ApiPropertyOptional({ example: 'male', enum: ['male', 'female'], description: 'Jinsi' })
  @IsOptional()
  @IsIn(['male', 'female'])
  gender?: 'male' | 'female';

  @ApiPropertyOptional({ example: 'AK', description: 'Avatar bosh harflari' })
  @IsOptional()
  @IsString()
  photoInitials?: string;

  @ApiPropertyOptional({ example: 215, description: 'Avatar rangi (0-360)' })
  @IsOptional()
  @IsInt()
  photoHue?: number;

  @ApiPropertyOptional({ example: 4.95, description: 'Reyting' })
  @IsOptional()
  @IsNumber()
  rating?: number;

  @ApiPropertyOptional({ example: 150, description: 'Sharhlar soni' })
  @IsOptional()
  @IsInt()
  reviewCount?: number;

  @ApiPropertyOptional({ description: 'Haftalik ish jadvali' })
  @IsOptional()
  schedule?: DoctorSchedule;

  @ApiPropertyOptional({ description: 'Sharhlar ro‘yxati' })
  @IsOptional()
  @IsArray()
  reviews?: DoctorReview[];
}
