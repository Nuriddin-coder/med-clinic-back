import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class QueryContactDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Saralash turi: createdAt-desc, createdAt-asc, name-asc, name-desc',
    example: 'createdAt-desc',
    enum: ['createdAt-desc', 'createdAt-asc', 'name-asc', 'name-desc'],
  })
  @IsOptional()
  @IsIn(['createdAt-desc', 'createdAt-asc', 'name-asc', 'name-desc'], {
    message: 'Yaroqsiz saralash parametri',
  })
  sort?: string;
}

