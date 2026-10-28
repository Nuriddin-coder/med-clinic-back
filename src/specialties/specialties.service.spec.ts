import { Test, TestingModule } from '@nestjs/testing';
import { SpecialtiesService } from './specialties.service';
import { DatabaseService } from '../database/database.service';

describe('SpecialtiesService pagination & search', () => {
  let service: SpecialtiesService;
  let mockDb: any;

  beforeEach(async () => {
    mockDb = {
      sql: jest.fn().mockResolvedValue([
        { id: 'sp-1', name: 'Kardiologiya', description: 'Yurak kasalliklari', icon: 'heart' },
        { id: 'sp-2', name: 'Nevrologiya', description: 'Asab tizimi kasalliklari', icon: 'brain' },
        { id: 'sp-3', name: 'Terapiya', description: 'Umumiy amaliyot', icon: 'stethoscope' },
      ]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpecialtiesService,
        { provide: DatabaseService, useValue: mockDb },
      ],
    }).compile();

    service = module.get<SpecialtiesService>(SpecialtiesService);
  });

  it('should return all specialties paginated', async () => {
    const res = await service.getAllSpecialties({ page: 1, limit: 2 });
    expect(res.total).toBe(3);
    expect(res.totalPages).toBe(2);
    expect(res.data.length).toBe(2);
    expect(res.hasNextPage).toBe(true);
    expect(res.data[0].name).toBe('Kardiologiya');
  });

  it('should search specialties by name', async () => {
    const res = await service.getAllSpecialties({ search: 'nevr' });
    expect(res.total).toBe(1);
    expect(res.data[0].name).toBe('Nevrologiya');
  });

  it('should sort specialties name descending', async () => {
    const res = await service.getAllSpecialties({ sort: 'name-desc' });
    expect(res.data[0].name).toBe('Terapiya');
  });
});

