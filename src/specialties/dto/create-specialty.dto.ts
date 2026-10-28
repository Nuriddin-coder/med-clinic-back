import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSpecialtyDto {
  @ApiPropertyOptional({
    example: 'sp-gastro',
    description: 'Mutaxassislik ID si (ixtiyoriy, kiritilmasa avtomatik generatsiya bo‘ladi)',
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: 'Gastroenterologiya', description: 'Mutaxassislik nomi' })
  @IsString()
  @IsNotEmpty({ message: 'Mutaxassislik nomi kiritilishi shart' })
  name: string;

  @ApiProperty({ example: 'Oshqozon-ichak trakti kasalliklarini davolash.', description: 'Tavsif' })
  @IsString()
  @IsNotEmpty({ message: 'Tavsif kiritilishi shart' })
  description: string;

  @ApiProperty({ example: 'activity', description: 'Lucide ikonka nomi (masalan: stethoscope, heart, brain, scan, activity)' })
  @IsString()
  @IsNotEmpty({ message: 'Ikonka nomi kiritilishi shart' })
  icon: string;
}
