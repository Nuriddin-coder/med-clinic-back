import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Doctor } from '../common/interfaces/clinic.interface';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(private readonly db: DatabaseService) {}

  private mapDoctorRow(row: any): Doctor {
    return {
      id: row.id,
      fullName: row.fullName,
      specialtyIds: typeof row.specialtyIds === 'string' ? JSON.parse(row.specialtyIds) : row.specialtyIds,
      title: row.title,
      experienceYears: Number(row.experienceYears),
      rating: Number(row.rating),
      reviewCount: Number(row.reviewCount),
      consultationPrice: Number(row.consultationPrice),
      bio: row.bio,
      education: typeof row.education === 'string' ? JSON.parse(row.education) : row.education,
      languages: typeof row.languages === 'string' ? JSON.parse(row.languages) : row.languages,
      gender: row.gender,
      photoInitials: row.photoInitials,
      photoHue: Number(row.photoHue),
      schedule: typeof row.schedule === 'string' ? JSON.parse(row.schedule) : row.schedule,
      reviews: typeof row.reviews === 'string' ? JSON.parse(row.reviews) : (row.reviews || []),
    };
  }

  async findAll(query?: { search?: string; specialtyId?: string; sort?: string }): Promise<Doctor[]> {
    const rows = await this.db.sql`
      SELECT 
        id, "fullName", "specialtyIds", title, "experienceYears", rating, "reviewCount",
        "consultationPrice", bio, education, languages, gender, "photoInitials", "photoHue",
        schedule, reviews
      FROM doctors
    `;

    let doctors: Doctor[] = rows.map(r => this.mapDoctorRow(r));

    if (query?.search && query.search.trim()) {
      const term = query.search.trim().toLowerCase();
      doctors = doctors.filter(
        d =>
          d.fullName.toLowerCase().includes(term) ||
          d.title.toLowerCase().includes(term) ||
          d.bio.toLowerCase().includes(term),
      );
    }

    if (query?.specialtyId && query.specialtyId.trim()) {
      const spec = query.specialtyId.trim();
      doctors = doctors.filter(d => Array.isArray(d.specialtyIds) && d.specialtyIds.includes(spec));
    }

    const sort = query?.sort || 'rating-desc';
    switch (sort) {
      case 'name-asc':
        doctors.sort((a, b) => a.fullName.localeCompare(b.fullName));
        break;
      case 'name-desc':
        doctors.sort((a, b) => b.fullName.localeCompare(a.fullName));
        break;
      case 'rating-desc':
        doctors.sort((a, b) => b.rating - a.rating);
        break;
      case 'experience-desc':
        doctors.sort((a, b) => b.experienceYears - a.experienceYears);
        break;
      case 'price-asc':
        doctors.sort((a, b) => a.consultationPrice - b.consultationPrice);
        break;
      case 'price-desc':
        doctors.sort((a, b) => b.consultationPrice - a.consultationPrice);
        break;
      default:
        doctors.sort((a, b) => b.rating - a.rating);
        break;
    }

    return doctors;
  }

  async findOne(id: string): Promise<Doctor> {
    const rows = await this.db.sql`
      SELECT 
        id, "fullName", "specialtyIds", title, "experienceYears", rating, "reviewCount",
        "consultationPrice", bio, education, languages, gender, "photoInitials", "photoHue",
        schedule, reviews
      FROM doctors
      WHERE id = ${id}
      LIMIT 1
    `;

    if (!rows || rows.length === 0) {
      throw new NotFoundException({
        message: 'Shifokor topilmadi',
        error: {
          message: 'Shifokor topilmadi',
          code: 'DOCTOR_NOT_FOUND',
        },
      });
    }

    return this.mapDoctorRow(rows[0]);
  }

  async create(dto: CreateDoctorDto): Promise<Doctor> {
    const id = dto.id && dto.id.trim() ? dto.id.trim() : `doc-${Date.now().toString(36)}`;

    // Check if ID exists
    const existing = await this.db.sql`
      SELECT id FROM doctors WHERE id = ${id} LIMIT 1
    `;
    if (existing && existing.length > 0) {
      throw new ConflictException({
        message: `"${id}" ID li shifokor allaqachon mavjud. Iltimos, boshqa ID tanlang yoki ID maydonini bo‘sh qoldiring.`,
        error: {
          message: `"${id}" ID li shifokor allaqachon mavjud`,
          code: 'DOCTOR_ALREADY_EXISTS',
        },
      });
    }

    let photoInitials = dto.photoInitials;
    if (!photoInitials) {
      const parts = dto.fullName.replace(/^Dr\.\s*/i, '').trim().split(' ');
      if (parts.length >= 2) {
        photoInitials = (parts[0][0] + parts[1][0]).toUpperCase();
      } else {
        photoInitials = parts[0].substring(0, 2).toUpperCase();
      }
    }

    const photoHue = dto.photoHue !== undefined ? dto.photoHue : Math.floor(Math.random() * 360);
    const rating = dto.rating !== undefined ? dto.rating : 5.0;
    const reviewCount = dto.reviewCount !== undefined ? dto.reviewCount : 0;
    const education = dto.education || [];
    const languages = dto.languages || ["O'zbek", 'Rus'];

    const defaultSchedule = {
      monday: { start: '09:00', end: '17:00' },
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: { start: '09:00', end: '17:00' },
      thursday: { start: '09:00', end: '17:00' },
      friday: { start: '09:00', end: '17:00' },
      saturday: { start: '09:00', end: '13:00' },
      sunday: null,
    };
    const schedule = dto.schedule || defaultSchedule;
    const reviews = dto.reviews || [];

    await this.db.sql`
      INSERT INTO doctors (
        id, "fullName", "specialtyIds", title, "experienceYears", rating, "reviewCount",
        "consultationPrice", bio, education, languages, gender, "photoInitials", "photoHue",
        schedule, reviews
      ) VALUES (
        ${id}, ${dto.fullName}, ${JSON.stringify(dto.specialtyIds)}, ${dto.title},
        ${dto.experienceYears}, ${rating}, ${reviewCount}, ${dto.consultationPrice},
        ${dto.bio}, ${JSON.stringify(education)}, ${JSON.stringify(languages)},
        ${dto.gender}, ${photoInitials}, ${photoHue}, ${JSON.stringify(schedule)},
        ${JSON.stringify(reviews)}
      )
    `;

    return {
      id,
      fullName: dto.fullName,
      specialtyIds: dto.specialtyIds,
      title: dto.title,
      experienceYears: dto.experienceYears,
      rating,
      reviewCount,
      consultationPrice: dto.consultationPrice,
      bio: dto.bio,
      education,
      languages,
      gender: dto.gender,
      photoInitials,
      photoHue,
      schedule,
      reviews,
    };
  }

  async update(id: string, dto: UpdateDoctorDto): Promise<Doctor> {
    const current = await this.findOne(id);

    const fullName = dto.fullName !== undefined ? dto.fullName : current.fullName;
    const specialtyIds = dto.specialtyIds !== undefined ? dto.specialtyIds : current.specialtyIds;
    const title = dto.title !== undefined ? dto.title : current.title;
    const experienceYears = dto.experienceYears !== undefined ? dto.experienceYears : current.experienceYears;
    const consultationPrice = dto.consultationPrice !== undefined ? dto.consultationPrice : current.consultationPrice;
    const bio = dto.bio !== undefined ? dto.bio : current.bio;
    const education = dto.education !== undefined ? dto.education : current.education;
    const languages = dto.languages !== undefined ? dto.languages : current.languages;
    const gender = dto.gender !== undefined ? dto.gender : current.gender;
    const photoInitials = dto.photoInitials !== undefined ? dto.photoInitials : current.photoInitials;
    const photoHue = dto.photoHue !== undefined ? dto.photoHue : current.photoHue;
    const rating = dto.rating !== undefined ? dto.rating : current.rating;
    const reviewCount = dto.reviewCount !== undefined ? dto.reviewCount : current.reviewCount;
    const schedule = dto.schedule !== undefined ? dto.schedule : current.schedule;
    const reviews = dto.reviews !== undefined ? dto.reviews : current.reviews;

    await this.db.sql`
      UPDATE doctors
      SET
        "fullName" = ${fullName},
        "specialtyIds" = ${JSON.stringify(specialtyIds)},
        title = ${title},
        "experienceYears" = ${experienceYears},
        rating = ${rating},
        "reviewCount" = ${reviewCount},
        "consultationPrice" = ${consultationPrice},
        bio = ${bio},
        education = ${JSON.stringify(education)},
        languages = ${JSON.stringify(languages)},
        gender = ${gender},
        "photoInitials" = ${photoInitials},
        "photoHue" = ${photoHue},
        schedule = ${JSON.stringify(schedule)},
        reviews = ${JSON.stringify(reviews)}
      WHERE id = ${id}
    `;

    return {
      id,
      fullName,
      specialtyIds,
      title,
      experienceYears,
      rating,
      reviewCount,
      consultationPrice,
      bio,
      education,
      languages,
      gender,
      photoInitials,
      photoHue,
      schedule,
      reviews,
    };
  }

  async delete(id: string): Promise<{ id: string; message: string }> {
    await this.findOne(id);

    await this.db.sql`
      DELETE FROM doctors
      WHERE id = ${id}
    `;

    return {
      id,
      message: 'Shifokor muvaffaqiyatli o‘chirildi',
    };
  }
}
