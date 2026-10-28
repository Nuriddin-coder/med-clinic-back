import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ContactMessage } from '../common/interfaces/clinic.interface';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(): Promise<ContactMessage[]> {
    const rows = await this.db.sql`
      SELECT id, "name", phone, email, message, "createdAt"
      FROM contact_messages
      ORDER BY "createdAt" DESC
    `;

    return rows.map(r => ({
      id: r.id,
      name: r.name,
      phone: r.phone,
      email: r.email,
      message: r.message,
      createdAt: r.createdAt,
    }));
  }

  async findOne(id: string): Promise<ContactMessage> {
    const rows = await this.db.sql`
      SELECT id, "name", phone, email, message, "createdAt"
      FROM contact_messages
      WHERE id = ${id}
      LIMIT 1
    `;

    if (!rows || rows.length === 0) {
      throw new NotFoundException({
        message: 'Murojaat topilmadi',
        error: {
          message: 'Murojaat topilmadi',
          code: 'CONTACT_NOT_FOUND',
        },
      });
    }

    const r = rows[0];
    return {
      id: r.id,
      name: r.name,
      phone: r.phone,
      email: r.email,
      message: r.message,
      createdAt: r.createdAt,
    };
  }

  async create(dto: CreateContactDto): Promise<ContactMessage> {
    const name = dto.name ? dto.name.trim() : '';
    if (name.length < 3) {
      throw new BadRequestException({
        message: 'Ism kamida 3 ta belgidan iborat bo‘lishi kerak',
        error: {
          message: 'Ism kamida 3 ta belgidan iborat bo‘lishi kerak',
          code: 'INVALID_NAME',
        },
      });
    }

    const phone = dto.phone ? dto.phone.trim() : '';
    if (!/^\+998\d{9}$/.test(phone)) {
      throw new BadRequestException({
        message: 'Telefon raqami noto‘g‘ri (+998XXXXXXXXX formati talab qilinadi)',
        error: {
          message: 'Telefon raqami noto‘g‘ri (+998XXXXXXXXX formati talab qilinadi)',
          code: 'INVALID_PHONE',
        },
      });
    }

    const email = dto.email ? dto.email.trim() : '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new BadRequestException({
        message: 'Elektron pochta manzili noto‘g‘ri',
        error: {
          message: 'Elektron pochta manzili noto‘g‘ri',
          code: 'INVALID_EMAIL',
        },
      });
    }

    const message = dto.message ? dto.message.trim() : '';
    if (message.length < 10 || message.length > 1000) {
      throw new BadRequestException({
        message: 'Xabar 10 dan 1000 belgiga bo‘lishi kerak',
        error: {
          message: 'Xabar 10 dan 1000 belgiga bo‘lishi kerak',
          code: 'INVALID_MESSAGE',
        },
      });
    }

    const id = `msg-${Date.now()}`;
    const createdAt = new Date().toISOString();

    await this.db.sql`
      INSERT INTO contact_messages (id, "name", phone, email, message, "createdAt")
      VALUES (${id}, ${name}, ${phone}, ${email}, ${message}, ${createdAt})
    `;

    return {
      id,
      name,
      phone,
      email,
      message,
      createdAt,
    };
  }

  async delete(id: string): Promise<{ id: string; message: string }> {
    await this.findOne(id);

    await this.db.sql`
      DELETE FROM contact_messages
      WHERE id = ${id}
    `;

    return {
      id,
      message: 'Murojaat muvaffaqiyatli o‘chirildi',
    };
  }
}
