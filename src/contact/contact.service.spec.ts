import { Test, TestingModule } from '@nestjs/testing';
import { ContactService } from './contact.service';
import { DatabaseService } from '../database/database.service';

describe('ContactService pagination & search', () => {
  let service: ContactService;
  let mockDb: any;

  beforeEach(async () => {
    mockDb = {
      sql: jest.fn().mockResolvedValue([
        {
          id: 'msg-1',
          name: 'Anvar Salimov',
          phone: '+998901234567',
          email: 'anvar@example.com',
          message: 'Assalomu alaykum, klinika ish vaqti haqida savol',
          createdAt: '2026-10-28T09:00:00Z',
        },
        {
          id: 'msg-2',
          name: 'Shahnoza Karimova',
          phone: '+998912345678',
          email: 'shahnoza@example.com',
          message: 'Tahlillar narxi qancha?',
          createdAt: '2026-10-28T10:00:00Z',
        },
      ]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        { provide: DatabaseService, useValue: mockDb },
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
  });

  it('should paginate contact messages', async () => {
    const res = await service.findAll({ page: 1, limit: 1 });
    expect(res.total).toBe(2);
    expect(res.totalPages).toBe(2);
    expect(res.data.length).toBe(1);
  });

  it('should search contact messages by text', async () => {
    const res = await service.findAll({ search: 'Tahlillar' });
    expect(res.total).toBe(1);
    expect(res.data[0].name).toBe('Shahnoza Karimova');
  });

  it('should sort contact messages by name', async () => {
    const res = await service.findAll({ sort: 'name-asc' });
    expect(res.data[0].name).toBe('Anvar Salimov');
    expect(res.data[1].name).toBe('Shahnoza Karimova');
  });
});

