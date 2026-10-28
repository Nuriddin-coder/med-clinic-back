import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSpecialtyDto {
  @ApiPropertyOptional({ example: 'Terapiya', description: 'Mutaxassislik nomi' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Yangi tavsif...', description: 'Tavsif' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'stethoscope', description: 'Lucide ikonka nomi' })
  @IsOptional()
  @IsString()
  icon?: string;
}

