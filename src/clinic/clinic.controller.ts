import { Body, Controller, Get, Patch, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClinicService } from './clinic.service';
import { ClinicInfo } from '../common/interfaces/clinic.interface';
import { UpdateClinicDto } from './dto/update-clinic.dto';

@ApiTags('Clinic')
@Controller('clinic')
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) {}

  @Get()
  @ApiOperation({ summary: 'Klinika haqida umumiy ma’lumotlarni olish' })
  @ApiResponse({ status: 200, description: 'Klinika ma’lumotlari' })
  async getClinicInfo(): Promise<ClinicInfo> {
    return this.clinicService.getClinicInfo();
  }

  @Patch()
  @ApiOperation({ summary: 'Klinika ma’lumotlarini tahrirlash (qisman yangilash)' })
  @ApiResponse({ status: 200, description: 'Yangilangan klinika ma’lumotlari' })
  async patchClinicInfo(@Body() updateClinicDto: UpdateClinicDto): Promise<ClinicInfo> {
    return this.clinicService.updateClinicInfo(updateClinicDto);
  }

  @Put()
  @ApiOperation({ summary: 'Klinika ma’lumotlarini to‘liq yangilash' })
  @ApiResponse({ status: 200, description: 'Yangilangan klinika ma’lumotlari' })
  async putClinicInfo(@Body() updateClinicDto: UpdateClinicDto): Promise<ClinicInfo> {
    return this.clinicService.updateClinicInfo(updateClinicDto);
  }
}
