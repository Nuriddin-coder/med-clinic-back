import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';
import { DatabaseService } from '../database/database.service';
import { DoctorsService } from '../doctors/doctors.service';
import { ServicesService } from '../services/services.service';
import { SlotsService } from '../slots/slots.service';

describe('AppointmentsService pagination & search', () => {
  let service: AppointmentsService;
  let mockDb: any;

  beforeEach(async () => {
    mockDb = {
      sql: jest.fn().mockResolvedValue([
        {
          id: 'apt-1',
          doctorId: 'doc-1',
          serviceId: 'srv-1',
          date: '2026-10-29',
          time: '09:00',
          durationMinutes: 30,
          patientName: 'Ali Valiyev',
          patientPhone: '+998901112233',
          notes: 'Tekshiruv uchun',
          status: 'pending',
          createdAt: '2026-10-28T10:00:00Z',
        },
        {
          id: 'apt-2',
          doctorId: 'doc-2',
          serviceId: 'srv-2',
          date: '2026-10-30',
          time: '11:00',
          durationMinutes: 45,
          patientName: 'Vali Aliyev',
          patientPhone: '+998909998877',
          notes: 'Qayta qabul',
          status: 'confirmed',
          createdAt: '2026-10-28T11:00:00Z',
        },
      ]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: DatabaseService, useValue: mockDb },
        { provide: DoctorsService, useValue: {} },
        { provide: ServicesService, useValue: {} },
        { provide: SlotsService, useValue: {} },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
  });

  it('should paginate appointments', async () => {
    const res = await service.findAll({ page: 1, limit: 1 });
    expect(res.total).toBe(2);
    expect(res.totalPages).toBe(2);
    expect(res.data.length).toBe(1);
  });

  it('should search appointments by patient name', async () => {
    const res = await service.findAll({ search: 'Vali Aliyev' });
    expect(res.total).toBe(1);
    expect(res.data[0].patientName).toBe('Vali Aliyev');
  });

  it('should filter appointments by status', async () => {
    const res = await service.findAll({ status: 'confirmed' });
    expect(res.total).toBe(1);
    expect(res.data[0].id).toBe('apt-2');
  });
});

