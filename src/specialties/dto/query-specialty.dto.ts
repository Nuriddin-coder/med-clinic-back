import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class QuerySpecialtyDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Saralash turi: name-asc, name-desc',
    example: 'name-asc',
    enum: ['name-asc', 'name-desc'],
  })
  @IsOptional()
  @IsIn(['name-asc', 'name-desc'], {
    message: 'sort faqat name-asc yoki name-desc bo‘lishi mumkin',
  })
  sort?: string;
}

