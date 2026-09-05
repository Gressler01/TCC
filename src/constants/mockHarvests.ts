import type { Harvest } from '../types/harvest';

export const mockHarvests: Harvest[] = [
  { id: 'harvest-1', date: '2025-05-20', quantityInGrams: 45000, notes: 'Morangos maduros, boa qualidade.' },
  { id: 'harvest-2', date: '2025-05-15', quantityInGrams: 32500, notes: '' },
  { id: 'harvest-3', date: '2025-05-10', quantityInGrams: 28000, notes: 'Colheita pela manhã.' },
  { id: 'harvest-4', date: '2025-05-05', quantityInGrams: 19000, notes: '' },
  { id: 'harvest-5', date: '2025-04-28', quantityInGrams: 42300, notes: '' },
];
