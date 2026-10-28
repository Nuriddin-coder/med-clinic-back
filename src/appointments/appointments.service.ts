import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { DoctorsService } from '../doctors/doctors.service';
import { ServicesService } from '../services/services.service';
import { SlotsService } from '../slots/slots.service';
import { Appointment } from '../common/interfaces/clinic.interface';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly doctorsService: DoctorsService,
    private readonly servicesService: ServicesService,
    private readonly slotsService: SlotsService,
  ) {}

  private mapAppointmentRow(row: any): Appointment {
    return {
      id: row.id,
      doctorId: row.doctorId,
      serviceId: row.serviceId,
      date: row.date,
      time: row.time,
      durationMinutes: Number(row.durationMinutes),
      patientName: row.patientName,
      patientPhone: row.patientPhone,
      notes: row.notes || '',
      status: row.status,
      createdAt: row.createdAt,
    };
  }

  async findAll(query?: {
    phone?: string;
    doctorId?: string;
    date?: string;
    status?: string;
  }): Promise<Appointment[]> {
    if (query?.phone) {
      const cleanPhone = query.phone.trim();
      if (!/^\+998\d{9}$/.test(cleanPhone)) {
        throw new BadRequestException({
          message: 'Telefon raqami noto‘g‘ri (+998XXXXXXXXX formati talab qilinadi)',
          error: {
            message: 'Telefon raqami noto‘g‘ri (+998XXXXXXXXX formati talab qilinadi)',
            code: 'INVALID_PHONE',
          },
        });
      }

      const rows = await this.db.sql`
        SELECT id, "doctorId", "serviceId", "date", "time", "durationMinutes", "patientName", "patientPhone", notes, status, "createdAt"
        FROM appointments
        WHERE "patientPhone" = ${cleanPhone}
        ORDER BY "createdAt" DESC, "date" DESC, "time" DESC
      `;
      return rows.map(r => this.mapAppointmentRow(r));
    }

    const rows = await this.db.sql`
      SELECT id, "doctorId", "serviceId", "date", "time", "durationMinutes", "patientName", "patientPhone", notes, status, "createdAt"
      FROM appointments
      ORDER BY "createdAt" DESC, "date" DESC, "time" DESC
    `;

    let appointments = rows.map(r => this.mapAppointmentRow(r));

    if (query?.doctorId) {
      appointments = appointments.filter(a => a.doctorId === query.doctorId);
    }
    if (query?.date) {
      appointments = appointments.filter(a => a.date === query.date);
    }
    if (query?.status) {
      appointments = appointments.filter(a => a.status === query.status);
    }

    return appointments;
  }

  async findOne(id: string): Promise<Appointment> {
    const rows = await this.db.sql`
      SELECT id, "doctorId", "serviceId", "date", "time", "durationMinutes", "patientName", "patientPhone", notes, status, "createdAt"
      FROM appointments
      WHERE id = ${id}
      LIMIT 1
    `;

    if (!rows || rows.length === 0) {
      throw new NotFoundException({
        message: 'Qabul topilmadi',
        error: {
          message: 'Qabul topilmadi',
          code: 'APPOINTMENT_NOT_FOUND',
        },
      });
    }

    return this.mapAppointmentRow(rows[0]);
  }

  async create(dto: CreateAppointmentDto): Promise<Appointment> {
    const phone = dto.patientPhone ? dto.patientPhone.trim() : '';
    if (!/^\+998\d{9}$/.test(phone)) {
      throw new BadRequestException({
        message: 'Telefon raqami noto‘g‘ri (+998XXXXXXXXX formati talab qilinadi)',
        error: {
          message: 'Telefon raqami noto‘g‘ri (+998XXXXXXXXX formati talab qilinadi)',
          code: 'INVALID_PHONE',
        },
      });
    }

    const name = dto.patientName ? dto.patientName.trim() : '';
    if (name.length < 3) {
      throw new BadRequestException({
        message: 'Ism kamida 3 ta belgidan iborat bo‘lishi kerak',
        error: {
          message: 'Ism kamida 3 ta belgidan iborat bo‘lishi kerak',
          code: 'INVALID_NAME',
        },
      });
    }

    const now = new Date();
    const tz = 'Asia/Tashkent';
    const formatterDate = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' });
    const todayStr = formatterDate.format(now);
    const formatterTime = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false });
    const currentTimeStr = formatterTime.format(now);

    if (dto.date < todayStr) {
      throw new BadRequestException({
        message: 'Sana o‘tmishda bo‘lishi mumkin emas',
        error: {
          message: 'Sana o‘tmishda bo‘lishi mumkin emas',
          code: 'PAST_DATE',
        },
      });
    }

    if (dto.date === todayStr && dto.time <= currentTimeStr) {
      throw new BadRequestException({
        message: 'Vaqt o‘tmishda bo‘lishi mumkin emas',
        error: {
          message: 'Vaqt o‘tmishda bo‘lishi mumkin emas',
          code: 'PAST_TIME',
        },
      });
    }

    await this.doctorsService.findOne(dto.doctorId);
    const service = await this.servicesService.findOne(dto.serviceId);

    const slots = await this.slotsService.calculateSlots(dto.doctorId, dto.date, dto.serviceId);
    const selectedSlot = slots.find(s => s.time === dto.time && s.available);

    if (!selectedSlot) {
      throw new BadRequestException({
        message: 'Bu vaqt band yoki mavjud emas. Boshqa slot tanlang.',
        error: {
          message: 'Bu vaqt band yoki mavjud emas. Boshqa slot tanlang.',
          code: 'SLOT_UNAVAILABLE',
        },
      });
    }

    const id = `apt-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const status = 'pending';
    const durationMinutes = service.durationMinutes || 30;
    const createdAt = new Date().toISOString();
    const notes = dto.notes ? dto.notes.trim() : '';

    await this.db.sql`
      INSERT INTO appointments (
        id, "doctorId", "serviceId", "date", "time", "durationMinutes",
        "patientName", "patientPhone", notes, status, "createdAt"
      ) VALUES (
        ${id}, ${dto.doctorId}, ${dto.serviceId}, ${dto.date}, ${dto.time},
        ${durationMinutes}, ${name}, ${phone}, ${notes}, ${status}, ${createdAt}
      )
    `;

    return {
      id,
      doctorId: dto.doctorId,
      serviceId: dto.serviceId,
      date: dto.date,
      time: dto.time,
      durationMinutes,
      patientName: name,
      patientPhone: phone,
      notes,
      status,
      createdAt,
    };
  }

  async cancel(id: string, dto: CancelAppointmentDto): Promise<Appointment> {
    const app = await this.findOne(id);

    const inputPhone = dto.phone ? dto.phone.trim() : '';
    if (app.patientPhone !== inputPhone) {
      throw new ForbiddenException({
        message: 'Bu qabul boshqa telefon raqamiga tegishli',
        error: {
          message: 'Bu qabul boshqa telefon raqamiga tegishli',
          code: 'FORBIDDEN',
        },
      });
    }

    if (app.status !== 'pending' && app.status !== 'confirmed') {
      throw new BadRequestException({
        message: 'Bu holatdagi qabulni bekor qilib bo‘lmaydi',
        error: {
          message: 'Bu holatdagi qabulni bekor qilib bo‘lmaydi',
          code: 'INVALID_STATUS',
        },
      });
    }

    await this.db.sql`
      UPDATE appointments
      SET status = 'cancelled'
      WHERE id = ${id}
    `;

    app.status = 'cancelled';
    return app;
  }

  async update(id: string, dto: UpdateAppointmentDto): Promise<Appointment> {
    const current = await this.findOne(id);

    const status = dto.status !== undefined ? dto.status : current.status;
    const notes = dto.notes !== undefined ? dto.notes : current.notes;

    await this.db.sql`
      UPDATE appointments
      SET status = ${status}, notes = ${notes}
      WHERE id = ${id}
    `;

    current.status = status;
    current.notes = notes;
    return current;
  }

  async delete(id: string): Promise<{ id: string; message: string }> {
    await this.findOne(id);

    await this.db.sql`
      DELETE FROM appointments
      WHERE id = ${id}
    `;

    return {
      id,
      message: 'Qabul muvaffaqiyatli o‘chirildi',
    };
  }
}
