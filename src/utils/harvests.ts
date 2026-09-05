import type { Harvest } from '../types/harvest';

// Store whole grams so that adding decimal kg never accumulates rounding errors.
export function parseHarvestQuantity(value: string): number | null {
  if (!/^\d+(?:[,.]\d{1,3})?$/.test(value.trim())) return null;

  const [whole, fraction = ''] = value.trim().replace(',', '.').split('.');
  const grams = Number(whole) * 1000 + Number(fraction.padEnd(3, '0'));
  return Number.isSafeInteger(grams) && grams > 0 ? grams : null;
}

export function formatHarvestQuantity(grams: number) {
  return `${(grams / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 3 })} kg`;
}

export function getMonthlyHarvests(harvests: Harvest[], period: string) {
  const records = harvests
    .filter((harvest) => harvest.date.slice(0, 7) === period)
    .sort((first, second) => second.date.localeCompare(first.date));

  return {
    records,
    totalInGrams: records.reduce((total, harvest) => total + harvest.quantityInGrams, 0),
  };
}
