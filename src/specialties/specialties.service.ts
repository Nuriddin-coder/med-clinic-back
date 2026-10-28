import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Specialty } from '../common/interfaces/clinic.interface';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';

@Injectable()
export class SpecialtiesService {
  constructor(private readonly db: DatabaseService) {}

  async getAllSpecialties(): Promise<Specialty[]> {
    const rows = await this.db.sql`
      SELECT id, "name", description, icon
      FROM specialties
      ORDER BY "name" ASC
    `;

    return rows.map(r => ({
      id: r.id,
      name: r.name,
      description: r.description,
      icon: r.icon,
    }));
  }

  async getSpecialtyById(id: string): Promise<Specialty> {
    const rows = await this.db.sql`
      SELECT id, "name", description, icon
      FROM specialties
      WHERE id = ${id}
      LIMIT 1
    `;

    if (!rows || rows.length === 0) {
      throw new NotFoundException({
        message: 'Mutaxassislik topilmadi',
        error: {
          message: 'Mutaxassislik topilmadi',
          code: 'SPECIALTY_NOT_FOUND',
        },
      });
    }

    return {
      id: rows[0].id,
      name: rows[0].name,
      description: rows[0].description,
      icon: rows[0].icon,
    };
  }

  async createSpecialty(dto: CreateSpecialtyDto): Promise<Specialty> {
    const id = dto.id && dto.id.trim()
      ? dto.id.trim()
      : `sp-${Date.now().toString(36)}`;

    // Agar ID oldindan mavjud bo'lsa, aniq tushunarli 409 xatolik qaytaramiz
    const existing = await this.db.sql`
      SELECT id FROM specialties WHERE id = ${id} LIMIT 1
    `;
    if (existing && existing.length > 0) {
      throw new ConflictException({
        message: `"${id}" identifikatorli mutaxassislik allaqachon mavjud. Iltimos, boshqa ID tanlang yoki ID maydonini bo‘sh qoldiring.`,
        error: {
          message: `"${id}" identifikatorli mutaxassislik allaqachon mavjud`,
          code: 'SPECIALTY_ALREADY_EXISTS',
        },
      });
    }

    await this.db.sql`
      INSERT INTO specialties (id, "name", description, icon)
      VALUES (${id}, ${dto.name}, ${dto.description}, ${dto.icon})
    `;

    return {
      id,
      name: dto.name,
      description: dto.description,
      icon: dto.icon,
    };
  }

  async updateSpecialty(id: string, dto: UpdateSpecialtyDto): Promise<Specialty> {
    const current = await this.getSpecialtyById(id);

    const name = dto.name !== undefined ? dto.name : current.name;
    const description = dto.description !== undefined ? dto.description : current.description;
    const icon = dto.icon !== undefined ? dto.icon : current.icon;

    await this.db.sql`
      UPDATE specialties
      SET "name" = ${name}, description = ${description}, icon = ${icon}
      WHERE id = ${id}
    `;

    return {
      id,
      name,
      description,
      icon,
    };
  }

  async deleteSpecialty(id: string): Promise<{ id: string; message: string }> {
    await this.getSpecialtyById(id);

    await this.db.sql`
      DELETE FROM specialties
      WHERE id = ${id}
    `;

    return {
      id,
      message: 'Mutaxassislik muvaffaqiyatli o‘chirildi',
    };
  }
}
