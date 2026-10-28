import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { DoctorsService } from '../doctors/doctors.service';
import { ServicesService } from '../services/services.service';
import { TimeSlot } from '../common/interfaces/clinic.interface';

@Injectable()
export class SlotsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly doctorsService: DoctorsService,
    private readonly servicesService: ServicesService,
  ) {}

  private toMinutes(timeStr: string): number {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  }

  private fromMinutes(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  async calculateSlots(doctorId: string, date: string, serviceId: string): Promise<TimeSlot[]> {
    if (!doctorId || !date || !serviceId) {
      throw new BadRequestException({
        message: 'doctorId, date va serviceId parametrlari talab qilinadi',
        error: {
          message: 'doctorId, date va serviceId parametrlari talab qilinadi',
          code: 'MISSING_PARAMS',
        },
      });
    }

    // 1. Shifokor va Xizmat tekshiruvi
    const doctor = await this.doctorsService.findOne(doctorId);
    const service = await this.servicesService.findOne(serviceId);

    // 2. date haftaning qaysi kuni ekanligini aniqlash
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const parts = date.split('-').map(Number);
    if (parts.length !== 3) {
      throw new BadRequestException({
        message: 'Sana formati noto‘g‘ri (YYYY-MM-DD bo‘lishi kerak)',
        error: {
          message: 'Sana formati noto‘g‘ri (YYYY-MM-DD bo‘lishi kerak)',
          code: 'INVALID_DATE_FORMAT',
        },
      });
    }
    const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
    const weekday = days[dateObj.getDay()] as keyof typeof doctor.schedule;

    // 3. Shifokorning shu kundagi schedule[weekday]
    const daySchedule = doctor.schedule ? doctor.schedule[weekday] : null;
    if (!daySchedule || !daySchedule.start || !daySchedule.end) {
      return [];
    }

    // 4. Mavjud band qabullarni olish (pending yoki confirmed)
    const appointments = await this.db.sql`
      SELECT "time", "durationMinutes", status
      FROM appointments
      WHERE "doctorId" = ${doctorId}
        AND "date" = ${date}
        AND status IN ('pending', 'confirmed')
    `;

    // 5. Bugungi sana va vaqtni aniqlash (Toshkent vaqti)
    const now = new Date();
    const tz = 'Asia/Tashkent';
    const formatterDate = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' });
    const todayStr = formatterDate.format(now);
    const formatterTime = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false });
    const currentTimeStr = formatterTime.format(now);
    const currentMinutes = this.toMinutes(currentTimeStr);

    const isPastDate = date < todayStr;
    const isToday = date === todayStr;

    const startMinutes = this.toMinutes(daySchedule.start);
    const endMinutes = this.toMinutes(daySchedule.end);
    const serviceDuration = service.durationMinutes || 30;

    const slots: TimeSlot[] = [];

    // Cursor 30 daqiqalik qadam bilan
    for (let cursor = startMinutes; cursor + serviceDuration <= endMinutes; cursor += 30) {
      const slotTimeStr = this.fromMinutes(cursor);
      const slotStart = cursor;
      const slotEnd = cursor + serviceDuration;

      let available = true;

      if (isPastDate) {
        available = false;
      } else if (isToday && slotStart <= currentMinutes) {
        available = false;
      } else {
        // To'qnashuv tekshiruvi: startA < endB && startB < endA
        for (const app of appointments) {
          const appStart = this.toMinutes(app.time);
          const appEnd = appStart + Number(app.durationMinutes);

          if (slotStart < appEnd && appStart < slotEnd) {
            available = false;
            break;
          }
        }
      }

      slots.push({
        time: slotTimeStr,
        available,
      });
    }

    return slots;
  }
}

