import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ClinicInfo } from '../common/interfaces/clinic.interface';
import { UpdateClinicDto } from './dto/update-clinic.dto';

@Injectable()
export class ClinicService {
  constructor(private readonly db: DatabaseService) {}

  async getClinicInfo(): Promise<ClinicInfo> {
    const rows = await this.db.sql`
      SELECT "name", tagline, about, address, phones, email, "workingHoursLabel", years, "patientCount", "doctorCount"
      FROM clinic_info
      WHERE id = 'main'
      LIMIT 1
    `;

    if (rows && rows.length > 0) {
      const row = rows[0];
      return {
        name: row.name,
        tagline: row.tagline,
        about: row.about,
        address: row.address,
        phones: typeof row.phones === 'string' ? JSON.parse(row.phones) : row.phones,
        email: row.email,
        workingHoursLabel: row.workingHoursLabel,
        years: Number(row.years),
        patientCount: Number(row.patientCount),
        doctorCount: Number(row.doctorCount),
      };
    }

    return {
      name: 'MED Clinic',
      tagline: 'Onlayn yozilish. Tirik navbatsiz qabul.',
      about:
        'MED Clinic — Toshkentdagi zamonaviy tibbiyot markazi. Biz diagnostika, mutaxassis konsultatsiyasi va keyingi kuzatuvni bitta joyda jamlaganmiz.',
      address: 'Toshkent shahar, Yunusobod tumani, Amir Temur ko‘chasi 108',
      phones: ['+998712000808', '+998901234567'],
      email: 'info@medclinic.uz',
      workingHoursLabel: 'Dushanba–Shanba 08:00–20:00, Yakshanba — dam olish',
      years: 12,
      patientCount: 18400,
      doctorCount: 10,
    };
  }

  async updateClinicInfo(dto: UpdateClinicDto): Promise<ClinicInfo> {
    const current = await this.getClinicInfo();

    const name = dto.name !== undefined ? dto.name : current.name;
    const tagline = dto.tagline !== undefined ? dto.tagline : current.tagline;
    const about = dto.about !== undefined ? dto.about : current.about;
    const address = dto.address !== undefined ? dto.address : current.address;
    const phones = dto.phones !== undefined ? dto.phones : current.phones;
    const email = dto.email !== undefined ? dto.email : current.email;
    const workingHoursLabel = dto.workingHoursLabel !== undefined ? dto.workingHoursLabel : current.workingHoursLabel;
    const years = dto.years !== undefined ? dto.years : current.years;
    const patientCount = dto.patientCount !== undefined ? dto.patientCount : current.patientCount;
    const doctorCount = dto.doctorCount !== undefined ? dto.doctorCount : current.doctorCount;

    await this.db.sql`
      INSERT INTO clinic_info (
        id, "name", tagline, about, address, phones, email, "workingHoursLabel", years, "patientCount", "doctorCount"
      ) VALUES (
        'main', ${name}, ${tagline}, ${about}, ${address}, ${JSON.stringify(phones)}, ${email},
        ${workingHoursLabel}, ${years}, ${patientCount}, ${doctorCount}
      )
      ON CONFLICT (id) DO UPDATE SET
        "name" = EXCLUDED."name",
        tagline = EXCLUDED.tagline,
        about = EXCLUDED.about,
        address = EXCLUDED.address,
        phones = EXCLUDED.phones,
        email = EXCLUDED.email,
        "workingHoursLabel" = EXCLUDED."workingHoursLabel",
        years = EXCLUDED.years,
        "patientCount" = EXCLUDED."patientCount",
        "doctorCount" = EXCLUDED."doctorCount"
    `;

    return {
      name,
      tagline,
      about,
      address,
      phones,
      email,
      workingHoursLabel,
      years,
      patientCount,
      doctorCount,
    };
  }
}
