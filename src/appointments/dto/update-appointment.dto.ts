import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import type { AppointmentStatus } from '../../common/interfaces/clinic.interface';

export class UpdateAppointmentDto {
  @ApiPropertyOptional({
    example: 'confirmed',
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'],
    description: 'Qabul holati',
  })
  @IsOptional()
  @IsIn(['pending', 'confirmed', 'completed', 'cancelled', 'no_show'], {
    message: 'status faqat pending, confirmed, completed, cancelled yoki no_show bo‘lishi mumkin',
  })
  status?: AppointmentStatus;

  @ApiPropertyOptional({ example: 'Bemor yetib keldi', description: 'Qo‘shimcha izoh' })
  @IsOptional()
  @IsString()
  notes?: string;
}
