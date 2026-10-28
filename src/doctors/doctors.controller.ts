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
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DoctorsService } from './doctors.service';
import { Doctor } from '../common/interfaces/clinic.interface';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { QueryDoctorDto } from './dto/query-doctor.dto';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';

@ApiTags('Doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  @ApiOperation({ summary: 'Shifokorlar ro‘yxatini olish (qidirish, sahifalash va saralash bilan)' })
  @ApiResponse({ status: 200, description: 'Shifokorlar sahifalangan ro‘yxati' })
  async findAll(@Query() query: QueryDoctorDto): Promise<PaginatedResponse<Doctor>> {
    return this.doctorsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta shifokor profilini olish' })
  @ApiResponse({ status: 200, description: 'Shifokor ma’lumotlari' })
  @ApiResponse({ status: 404, description: 'Shifokor topilmadi' })
  async findOne(@Param('id') id: string): Promise<Doctor> {
    return this.doctorsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Yangi shifokor qo‘shish' })
  @ApiResponse({ status: 201, description: 'Shifokor muvaffaqiyatli yaratildi' })
  @ApiResponse({ status: 400, description: 'Validatsiya xatoligi' })
  async create(@Body() createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    return this.doctorsService.create(createDoctorDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Shifokor ma’lumotlarini qisman tahrirlash' })
  @ApiResponse({ status: 200, description: 'Yangilangan shifokor' })
  @ApiResponse({ status: 404, description: 'Shifokor topilmadi' })
  async update(
    @Param('id') id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ): Promise<Doctor> {
    return this.doctorsService.update(id, updateDoctorDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Shifokor ma’lumotlarini to‘liq yangilash' })
  @ApiResponse({ status: 200, description: 'Yangilangan shifokor' })
  @ApiResponse({ status: 404, description: 'Shifokor topilmadi' })
  async put(
    @Param('id') id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ): Promise<Doctor> {
    return this.doctorsService.update(id, updateDoctorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Shifokorni o‘chirish' })
  @ApiResponse({ status: 200, description: 'Shifokor o‘chirildi' })
  @ApiResponse({ status: 404, description: 'Shifokor topilmadi' })
  async delete(@Param('id') id: string): Promise<{ id: string; message: string }> {
    return this.doctorsService.delete(id);
  }
}
