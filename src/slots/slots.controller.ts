import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { SlotsService } from './slots.service';
import { TimeSlot } from '../common/interfaces/clinic.interface';

@ApiTags('Slots')
@Controller('slots')
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Get()
  @ApiOperation({ summary: 'Shifokorning tanlangan kundagi bo‘sh vaqt slotlarini hisoblash' })
  @ApiQuery({ name: 'doctorId', required: true, description: 'Shifokor ID si (masalan: doc-1)' })
  @ApiQuery({ name: 'date', required: true, description: 'Sana (YYYY-MM-DD, masalan: 2026-10-29)' })
  @ApiQuery({ name: 'serviceId', required: true, description: 'Xizmat ID si (masalan: srv-consult-therapy)' })
  @ApiResponse({ status: 200, description: 'Vaqt slotlari ro‘yxati' })
  async getSlots(
    @Query('doctorId') doctorId: string,
    @Query('date') date: string,
    @Query('serviceId') serviceId: string,
  ): Promise<TimeSlot[]> {
    return this.slotsService.calculateSlots(doctorId, date, serviceId);
  }
}

