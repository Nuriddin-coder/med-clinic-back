import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from '../common/interfaces/clinic.interface';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Qabullar ro‘yxatini olish (telefon, shifokor yoki sana bo‘yicha filtr bilan)' })
  @ApiQuery({ name: 'phone', required: false, description: 'Bemor telefon raqami (+998901234567)' })
  @ApiQuery({ name: 'doctorId', required: false, description: 'Shifokor ID si' })
  @ApiQuery({ name: 'date', required: false, description: 'Sana (YYYY-MM-DD)' })
  @ApiQuery({ name: 'status', required: false, description: 'Holat (pending, confirmed, completed, cancelled)' })
  @ApiResponse({ status: 200, description: 'Qabullar ro‘yxati' })
  @ApiResponse({ status: 400, description: 'Telefon raqami noto‘g‘ri' })
  async findAll(
    @Query('phone') phone?: string,
    @Query('doctorId') doctorId?: string,
    @Query('date') date?: string,
    @Query('status') status?: string,
  ): Promise<Appointment[]> {
    return this.appointmentsService.findAll({ phone, doctorId, date, status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta qabul ma’lumotini olish' })
  @ApiResponse({ status: 200, description: 'Qabul ma’lumotlari' })
  @ApiResponse({ status: 404, description: 'Qabul topilmadi' })
  async findOne(@Param('id') id: string): Promise<Appointment> {
    return this.appointmentsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Yangi qabulga yozilish' })
  @ApiResponse({ status: 201, description: 'Qabul muvaffaqiyatli yaratildi' })
  @ApiResponse({ status: 400, description: 'Validatsiya xatoligi yoki vaqt band' })
  @ApiResponse({ status: 404, description: 'Shifokor yoki xizmat topilmadi' })
  async create(@Body() createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Qabul holatini yoki izohini yangilash (Admin / Shifokor)' })
  @ApiResponse({ status: 200, description: 'Yangilangan qabul' })
  @ApiResponse({ status: 404, description: 'Qabul topilmadi' })
  async update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Bemor tomonidan qabulni bekor qilish' })
  @ApiResponse({ status: 200, description: 'Qabul muvaffaqiyatli bekor qilindi' })
  @ApiResponse({ status: 400, description: 'Bekor qilib bo‘lmaydigan holat' })
  @ApiResponse({ status: 403, description: 'Boshqa telefon raqamiga tegishli qabul' })
  @ApiResponse({ status: 404, description: 'Qabul topilmadi' })
  async cancel(
    @Param('id') id: string,
    @Body() cancelAppointmentDto: CancelAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentsService.cancel(id, cancelAppointmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Qabulni butunlay o‘chirish' })
  @ApiResponse({ status: 200, description: 'Qabul o‘chirildi' })
  @ApiResponse({ status: 404, description: 'Qabul topilmadi' })
  async delete(@Param('id') id: string): Promise<{ id: string; message: string }> {
    return this.appointmentsService.delete(id);
  }
}
