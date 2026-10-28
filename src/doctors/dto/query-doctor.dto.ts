import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class QueryDoctorDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Mutaxassislik ID si bo‘yicha filter',
    example: 'sp-cardio',
  })
  @IsOptional()
  @IsString()
  specialtyId?: string;

  @ApiPropertyOptional({
    description: 'Jinsi bo‘yicha filter (male yoki female)',
    example: 'male',
    enum: ['male', 'female'],
  })
  @IsOptional()
  @IsIn(['male', 'female'], { message: 'gender faqat male yoki female bo‘lishi mumkin' })
  gender?: 'male' | 'female';

  @ApiPropertyOptional({
    description:
      'Saralash turi: name-asc, name-desc, rating-desc, experience-desc, price-asc, price-desc',
    example: 'rating-desc',
    enum: [
      'name-asc',
      'name-desc',
      'rating-desc',
      'experience-desc',
      'price-asc',
      'price-desc',
    ],
  })
  @IsOptional()
  @IsIn(
    [
      'name-asc',
      'name-desc',
      'rating-desc',
      'experience-desc',
      'price-asc',
      'price-desc',
    ],
    { message: 'Yaroqsiz saralash parametri' },
  )
  sort?: string;
}

