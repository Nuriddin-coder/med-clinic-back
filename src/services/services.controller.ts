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
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { ServiceItem } from '../common/interfaces/clinic.interface';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'Xizmatlar ro‘yxatini olish (qidirish va saralash bilan)' })
  @ApiQuery({ name: 'search', required: false, description: 'Nomi yoki tavsifi bo‘yicha qidirish' })
  @ApiQuery({ name: 'specialtyId', required: false, description: 'Mutaxassislik ID si bo‘yicha filter' })
  @ApiQuery({
    name: 'sort',
    required: false,
    description: 'Saralash turi: name-asc, price-asc, price-desc, duration-asc',
  })
  @ApiResponse({ status: 200, description: 'Xizmatlar ro‘yxati' })
  async findAll(
    @Query('search') search?: string,
    @Query('specialtyId') specialtyId?: string,
    @Query('sort') sort?: string,
  ): Promise<ServiceItem[]> {
    return this.servicesService.findAll({ search, specialtyId, sort });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta xizmat ma’lumotini olish' })
  @ApiResponse({ status: 200, description: 'Xizmat ma’lumotlari' })
  @ApiResponse({ status: 404, description: 'Xizmat topilmadi' })
  async findOne(@Param('id') id: string): Promise<ServiceItem> {
    return this.servicesService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Yangi xizmat qo‘shish' })
  @ApiResponse({ status: 201, description: 'Xizmat muvaffaqiyatli yaratildi' })
  @ApiResponse({ status: 400, description: 'Validatsiya xatoligi' })
  async create(@Body() createServiceDto: CreateServiceDto): Promise<ServiceItem> {
    return this.servicesService.create(createServiceDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Xizmatni qisman tahrirlash' })
  @ApiResponse({ status: 200, description: 'Yangilangan xizmat' })
  @ApiResponse({ status: 404, description: 'Xizmat topilmadi' })
  async update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ): Promise<ServiceItem> {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Xizmatni to‘liq yangilash' })
  @ApiResponse({ status: 200, description: 'Yangilangan xizmat' })
  @ApiResponse({ status: 404, description: 'Xizmat topilmadi' })
  async put(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ): Promise<ServiceItem> {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xizmatni o‘chirish' })
  @ApiResponse({ status: 200, description: 'Xizmat o‘chirildi' })
  @ApiResponse({ status: 404, description: 'Xizmat topilmadi' })
  async delete(@Param('id') id: string): Promise<{ id: string; message: string }> {
    return this.servicesService.delete(id);
  }
}
