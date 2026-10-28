import { paginate } from './pagination-query.dto';

describe('paginate helper', () => {
  const sampleItems = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
  }));

  it('should paginate items with default page and limit', () => {
    const result = paginate(sampleItems);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.total).toBe(25);
    expect(result.totalPages).toBe(3);
    expect(result.hasNextPage).toBe(true);
    expect(result.hasPrevPage).toBe(false);
    expect(result.data.length).toBe(10);
    expect(result.data[0].id).toBe(1);
    expect(result.data[9].id).toBe(10);
  });

  it('should return second page correctly', () => {
    const result = paginate(sampleItems, 2, 10);
    expect(result.page).toBe(2);
    expect(result.limit).toBe(10);
    expect(result.hasNextPage).toBe(true);
    expect(result.hasPrevPage).toBe(true);
    expect(result.data.length).toBe(10);
    expect(result.data[0].id).toBe(11);
  });

  it('should return last page correctly', () => {
    const result = paginate(sampleItems, 3, 10);
    expect(result.page).toBe(3);
    expect(result.limit).toBe(10);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPrevPage).toBe(true);
    expect(result.data.length).toBe(5);
    expect(result.data[0].id).toBe(21);
    expect(result.data[4].id).toBe(25);
  });

  it('should handle empty array', () => {
    const result = paginate([], 1, 10);
    expect(result.total).toBe(0);
    expect(result.totalPages).toBe(1);
    expect(result.data).toEqual([]);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPrevPage).toBe(false);
  });
});

