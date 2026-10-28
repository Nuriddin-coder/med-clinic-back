import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateServiceDto {
  @ApiPropertyOptional({ example: 'srv-consult-gastro', description: 'Xizmat ID si (ixtiyoriy, kiritilmasa avtomatik generatsiya qilinadi)' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: 'Gastroenterolog konsultatsiyasi', description: 'Xizmat nomi' })
  @IsString()
  @IsNotEmpty({ message: 'Xizmat nomi kiritilishi shart' })
  name: string;

  @ApiProperty({ example: 'Oshqozon va ovqat hazm qilish tizimi bo‘yicha konsultatsiya...', description: 'Xizmat tavsifi' })
  @IsString()
  @IsNotEmpty({ message: 'Xizmat tavsifi kiritilishi shart' })
  description: string;

  @ApiProperty({ example: 'sp-therapy', description: 'Bog‘langan mutaxassislik ID si' })
  @IsString()
  @IsNotEmpty({ message: 'specialtyId kiritilishi shart' })
  specialtyId: string;

  @ApiProperty({ example: 30, description: 'Davomiyligi (daqiqa)' })
  @IsInt()
  @Min(5, { message: 'Davomiyligi kamida 5 daqiqa bo‘lishi kerak' })
  durationMinutes: number;

  @ApiProperty({ example: 190000, description: 'Xizmat narxi (so‘mda)' })
  @IsInt()
  @Min(0, { message: 'Narx musbat son bo‘lishi kerak' })
  price: number;
}
