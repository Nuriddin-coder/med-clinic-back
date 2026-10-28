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
import { ServicesService } from './services.service';
import { ServiceItem } from '../common/interfaces/clinic.interface';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { QueryServiceDto } from './dto/query-service.dto';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'Xizmatlar ro‘yxatini olish (qidirish, sahifalash va saralash bilan)' })
  @ApiResponse({ status: 200, description: 'Xizmatlar sahifalangan ro‘yxati' })
  async findAll(@Query() query: QueryServiceDto): Promise<PaginatedResponse<ServiceItem>> {
    return this.servicesService.findAll(query);
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
