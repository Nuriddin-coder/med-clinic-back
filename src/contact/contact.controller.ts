import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactMessage } from '../common/interfaces/clinic.interface';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  @ApiOperation({ summary: 'Barcha kelib tushgan murojaatlar ro‘yxatini olish' })
  @ApiResponse({ status: 200, description: 'Murojaatlar ro‘yxati' })
  async findAll(): Promise<ContactMessage[]> {
    return this.contactService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta murojaatni ko‘rish' })
  @ApiResponse({ status: 200, description: 'Murojaat ma’lumotlari' })
  @ApiResponse({ status: 404, description: 'Murojaat topilmadi' })
  async findOne(@Param('id') id: string): Promise<ContactMessage> {
    return this.contactService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Aloqa formasi orqali yangi xabar yuborish' })
  @ApiResponse({ status: 201, description: 'Xabar muvaffaqiyatli qabul qilindi' })
  @ApiResponse({ status: 400, description: 'Validatsiya xatoligi' })
  async create(@Body() createContactDto: CreateContactDto): Promise<ContactMessage> {
    return this.contactService.create(createContactDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Murojaatni o‘chirish' })
  @ApiResponse({ status: 200, description: 'Murojaat o‘chirildi' })
  @ApiResponse({ status: 404, description: 'Murojaat topilmadi' })
  async delete(@Param('id') id: string): Promise<{ id: string; message: string }> {
    return this.contactService.delete(id);
  }
}
