import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateServiceDto {
  @ApiPropertyOptional({ example: 'Terapevt konsultatsiyasi', description: 'Xizmat nomi' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Yangilangan tavsif...', description: 'Xizmat tavsifi' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'sp-therapy', description: 'Bog‘langan mutaxassislik ID si' })
  @IsOptional()
  @IsString()
  specialtyId?: string;

  @ApiPropertyOptional({ example: 45, description: 'Davomiyligi (daqiqa)' })
  @IsOptional()
  @IsInt()
  @Min(5)
  durationMinutes?: number;

  @ApiPropertyOptional({ example: 200000, description: 'Xizmat narxi (so‘mda)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number;
}

