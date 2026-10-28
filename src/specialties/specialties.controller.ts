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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SpecialtiesService } from './specialties.service';
import { Specialty } from '../common/interfaces/clinic.interface';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';

@ApiTags('Specialties')
@Controller('specialties')
export class SpecialtiesController {
  constructor(private readonly specialtiesService: SpecialtiesService) {}

  @Get()
  @ApiOperation({ summary: 'Barcha mutaxassisliklar ro‘yxatini olish' })
  @ApiResponse({ status: 200, description: 'Mutaxassisliklar ro‘yxati' })
  async getSpecialties(): Promise<Specialty[]> {
    return this.specialtiesService.getAllSpecialties();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta mutaxassislikni olish' })
  @ApiResponse({ status: 200, description: 'Mutaxassislik ma’lumotlari' })
  @ApiResponse({ status: 404, description: 'Mutaxassislik topilmadi' })
  async getSpecialtyById(@Param('id') id: string): Promise<Specialty> {
    return this.specialtiesService.getSpecialtyById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Yangi mutaxassislik qo‘shish' })
  @ApiResponse({ status: 201, description: 'Mutaxassislik muvaffaqiyatli yaratildi' })
  @ApiResponse({ status: 400, description: 'Validatsiya xatoligi' })
  async createSpecialty(@Body() createSpecialtyDto: CreateSpecialtyDto): Promise<Specialty> {
    return this.specialtiesService.createSpecialty(createSpecialtyDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mutaxassislikni qisman tahrirlash' })
  @ApiResponse({ status: 200, description: 'Yangilangan mutaxassislik' })
  @ApiResponse({ status: 404, description: 'Mutaxassislik topilmadi' })
  async updateSpecialty(
    @Param('id') id: string,
    @Body() updateSpecialtyDto: UpdateSpecialtyDto,
  ): Promise<Specialty> {
    return this.specialtiesService.updateSpecialty(id, updateSpecialtyDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mutaxassislikni to‘liq yangilash' })
  @ApiResponse({ status: 200, description: 'Yangilangan mutaxassislik' })
  @ApiResponse({ status: 404, description: 'Mutaxassislik topilmadi' })
  async putSpecialty(
    @Param('id') id: string,
    @Body() updateSpecialtyDto: UpdateSpecialtyDto,
  ): Promise<Specialty> {
    return this.specialtiesService.updateSpecialty(id, updateSpecialtyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Mutaxassislikni o‘chirish' })
  @ApiResponse({ status: 200, description: 'Mutaxassislik o‘chirildi' })
  @ApiResponse({ status: 404, description: 'Mutaxassislik topilmadi' })
  async deleteSpecialty(@Param('id') id: string): Promise<{ id: string; message: string }> {
    return this.specialtiesService.deleteSpecialty(id);
  }
}
