import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class QueryAppointmentDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Bemor telefon raqami (+998XXXXXXXXX)',
    example: '+998901234567',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Shifokor ID si bo‘yicha filter',
    example: 'doc-1',
  })
  @IsOptional()
  @IsString()
  doctorId?: string;

  @ApiPropertyOptional({
    description: 'Xizmat ID si bo‘yicha filter',
    example: 'srv-consult-therapy',
  })
  @IsOptional()
  @IsString()
  serviceId?: string;

  @ApiPropertyOptional({
    description: 'Sana bo‘yicha filter (YYYY-MM-DD)',
    example: '2026-10-29',
  })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiPropertyOptional({
    description: 'Qabul holati bo‘yicha filter',
    example: 'pending',
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'],
  })
  @IsOptional()
  @IsIn(['pending', 'confirmed', 'completed', 'cancelled', 'no_show'], {
    message: 'Yaroqsiz status parametri',
  })
  status?: string;

  @ApiPropertyOptional({
    description:
      'Saralash turi: createdAt-desc, createdAt-asc, date-desc, date-asc, patientName-asc, patientName-desc',
    example: 'createdAt-desc',
    enum: [
      'createdAt-desc',
      'createdAt-asc',
      'date-desc',
      'date-asc',
      'patientName-asc',
      'patientName-desc',
    ],
  })
  @IsOptional()
  @IsIn(
    [
      'createdAt-desc',
      'createdAt-asc',
      'date-desc',
      'date-asc',
      'patientName-asc',
      'patientName-desc',
    ],
    { message: 'Yaroqsiz saralash parametri' },
  )
  sort?: string;
}

