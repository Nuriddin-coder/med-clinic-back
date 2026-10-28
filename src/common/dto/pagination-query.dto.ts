import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { PaginatedResponse, PaginationMeta } from '../interfaces/pagination.interface';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Qidiruv so‘zi (matn bo‘yicha filter)',
    example: 'kardiolog',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Sahifa raqami (1 dan boshlanadi)',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Har bir sahifadagi elementlar soni (maksimal 100)',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

export function paginate<T>(
  items: T[],
  page?: number,
  limit?: number,
): PaginatedResponse<T> {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.max(1, Math.min(100, Number(limit) || 10));

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));
  const offset = (safePage - 1) * safeLimit;
  const data = items.slice(offset, offset + safeLimit);

  const meta: PaginationMeta = {
    total,
    page: safePage,
    limit: safeLimit,
    totalPages,
    hasNextPage: safePage < totalPages,
    hasPrevPage: safePage > 1,
  };

  return {
    data,
    ...meta,
    meta,
  };
}

