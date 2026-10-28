import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class QueryServiceDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Mutaxassislik ID si bo‘yicha filter',
    example: 'sp-therapy',
  })
  @IsOptional()
  @IsString()
  specialtyId?: string;

  @ApiPropertyOptional({
    description: 'Minimal narx',
    example: 50000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Maksimal narx',
    example: 500000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({
    description:
      'Saralash turi: name-asc, name-desc, price-asc, price-desc, duration-asc, duration-desc',
    example: 'name-asc',
    enum: [
      'name-asc',
      'name-desc',
      'price-asc',
      'price-desc',
      'duration-asc',
      'duration-desc',
    ],
  })
  @IsOptional()
  @IsIn(
    [
      'name-asc',
      'name-desc',
      'price-asc',
      'price-desc',
      'duration-asc',
      'duration-desc',
    ],
    { message: 'Yaroqsiz saralash parametri' },
  )
  sort?: string;
}

