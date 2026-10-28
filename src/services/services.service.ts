import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ServiceItem } from '../common/interfaces/clinic.interface';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { QueryServiceDto } from './dto/query-service.dto';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';
import { paginate } from '../common/dto/pagination-query.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly db: DatabaseService) {}

  private mapServiceRow(row: any): ServiceItem {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      specialtyId: row.specialtyId,
      durationMinutes: Number(row.durationMinutes),
      price: Number(row.price),
    };
  }

  async findAll(query?: QueryServiceDto): Promise<PaginatedResponse<ServiceItem>> {
    const rows = await this.db.sql`
      SELECT id, "name", description, "specialtyId", "durationMinutes", price
      FROM services
    `;

    let services: ServiceItem[] = rows.map(r => this.mapServiceRow(r));

    if (query?.search && query.search.trim()) {
      const term = query.search.trim().toLowerCase();
      services = services.filter(
        s =>
          (s.name && s.name.toLowerCase().includes(term)) ||
          (s.description && s.description.toLowerCase().includes(term)),
      );
    }

    if (query?.specialtyId && query.specialtyId.trim()) {
      const spec = query.specialtyId.trim();
      services = services.filter(s => s.specialtyId === spec);
    }

    if (query?.minPrice !== undefined && !isNaN(Number(query.minPrice))) {
      services = services.filter(s => s.price >= Number(query.minPrice));
    }

    if (query?.maxPrice !== undefined && !isNaN(Number(query.maxPrice))) {
      services = services.filter(s => s.price <= Number(query.maxPrice));
    }

    const sort = query?.sort || 'name-asc';
    switch (sort) {
      case 'name-asc':
        services.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        services.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        services.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        services.sort((a, b) => b.price - a.price);
        break;
      case 'duration-asc':
        services.sort((a, b) => a.durationMinutes - b.durationMinutes);
        break;
      case 'duration-desc':
        services.sort((a, b) => b.durationMinutes - a.durationMinutes);
        break;
      default:
        services.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return paginate(services, query?.page, query?.limit);
  }

  async findOne(id: string): Promise<ServiceItem> {
    const rows = await this.db.sql`
      SELECT id, "name", description, "specialtyId", "durationMinutes", price
      FROM services
      WHERE id = ${id}
      LIMIT 1
    `;

    if (!rows || rows.length === 0) {
      throw new NotFoundException({
        message: 'Xizmat topilmadi',
        error: {
          message: 'Xizmat topilmadi',
          code: 'SERVICE_NOT_FOUND',
        },
      });
    }

    return this.mapServiceRow(rows[0]);
  }

  async create(dto: CreateServiceDto): Promise<ServiceItem> {
    const id = dto.id && dto.id.trim() ? dto.id.trim() : `srv-${Date.now().toString(36)}`;

    const existing = await this.db.sql`
      SELECT id FROM services WHERE id = ${id} LIMIT 1
    `;
    if (existing && existing.length > 0) {
      throw new ConflictException({
        message: `"${id}" ID li xizmat allaqachon mavjud. Iltimos, boshqa ID tanlang yoki ID maydonini bo‘sh qoldiring.`,
        error: {
          message: `"${id}" ID li xizmat allaqachon mavjud`,
          code: 'SERVICE_ALREADY_EXISTS',
        },
      });
    }

    await this.db.sql`
      INSERT INTO services (id, "name", description, "specialtyId", "durationMinutes", price)
      VALUES (${id}, ${dto.name}, ${dto.description}, ${dto.specialtyId}, ${dto.durationMinutes}, ${dto.price})
    `;

    return {
      id,
      name: dto.name,
      description: dto.description,
      specialtyId: dto.specialtyId,
      durationMinutes: dto.durationMinutes,
      price: dto.price,
    };
  }

  async update(id: string, dto: UpdateServiceDto): Promise<ServiceItem> {
    const current = await this.findOne(id);

    const name = dto.name !== undefined ? dto.name : current.name;
    const description = dto.description !== undefined ? dto.description : current.description;
    const specialtyId = dto.specialtyId !== undefined ? dto.specialtyId : current.specialtyId;
    const durationMinutes = dto.durationMinutes !== undefined ? dto.durationMinutes : current.durationMinutes;
    const price = dto.price !== undefined ? dto.price : current.price;

    await this.db.sql`
      UPDATE services
      SET
        "name" = ${name},
        description = ${description},
        "specialtyId" = ${specialtyId},
        "durationMinutes" = ${durationMinutes},
        price = ${price}
      WHERE id = ${id}
    `;

    return {
      id,
      name,
      description,
      specialtyId,
      durationMinutes,
      price,
    };
  }

  async delete(id: string): Promise<{ id: string; message: string }> {
    await this.findOne(id);

    await this.db.sql`
      DELETE FROM services
      WHERE id = ${id}
    `;

    return {
      id,
      message: 'Xizmat muvaffaqiyatli o‘chirildi',
    };
  }
}
