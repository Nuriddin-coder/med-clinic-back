import { Test, TestingModule } from '@nestjs/testing';
import { DoctorsService } from './doctors.service';
import { DatabaseService } from '../database/database.service';

describe('DoctorsService pagination & search', () => {
  let service: DoctorsService;
  let mockDb: any;

  beforeEach(async () => {
    mockDb = {
      sql: jest.fn().mockResolvedValue([
        {
          id: 'doc-1',
          fullName: 'Dr. Sardor Ikromov',
          specialtyIds: JSON.stringify(['sp-1']),
          title: 'Kardiolog',
          experienceYears: 10,
          rating: 4.9,
          reviewCount: 25,
          consultationPrice: 200000,
          bio: 'Kardiologiya boyicha yetakchi mutaxassis',
          education: '[]',
          languages: JSON.stringify(['O‘zbek', 'Rus']),
          gender: 'male',
          photoInitials: 'SI',
          photoHue: 120,
          schedule: '{}',
          reviews: '[]',
        },
        {
          id: 'doc-2',
          fullName: 'Dr. Nilufar Karimova',
          specialtyIds: JSON.stringify(['sp-2']),
          title: 'Nevrolog',
          experienceYears: 7,
          rating: 4.7,
          reviewCount: 15,
          consultationPrice: 180000,
          bio: 'Asab tizimi kasalliklari mutaxassisi',
          education: '[]',
          languages: JSON.stringify(['O‘zbek', 'Ingliz']),
          gender: 'female',
          photoInitials: 'NK',
          photoHue: 200,
          schedule: '{}',
          reviews: '[]',
        },
      ]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorsService,
        { provide: DatabaseService, useValue: mockDb },
      ],
    }).compile();

    service = module.get<DoctorsService>(DoctorsService);
  });

  it('should paginate doctors', async () => {
    const res = await service.findAll({ page: 1, limit: 1 });
    expect(res.total).toBe(2);
    expect(res.totalPages).toBe(2);
    expect(res.data.length).toBe(1);
    expect(res.hasNextPage).toBe(true);
  });

  it('should filter doctors by search query', async () => {
    const res = await service.findAll({ search: 'Nilufar' });
    expect(res.total).toBe(1);
    expect(res.data[0].fullName).toBe('Dr. Nilufar Karimova');
  });

  it('should filter doctors by gender', async () => {
    const res = await service.findAll({ gender: 'female' });
    expect(res.total).toBe(1);
    expect(res.data[0].fullName).toBe('Dr. Nilufar Karimova');
  });

  it('should sort doctors by consultation price asc', async () => {
    const res = await service.findAll({ sort: 'price-asc' });
    expect(res.data[0].consultationPrice).toBe(180000);
    expect(res.data[1].consultationPrice).toBe(200000);
  });
});

