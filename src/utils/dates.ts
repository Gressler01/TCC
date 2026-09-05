export function toLocalDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDate(value: string): string | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return null;

  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) return null;

  return `${year}-${month}-${day}`;
}

export function formatDate(date: string) {
  return date.split('-').reverse().join('/');
}

export function maskDate(value: string) {
  return value.replace(/\D/g, '').slice(0, 8)
    .replace(/^(\d{2})(\d)/, '$1/$2')
    .replace(/^(\d{2}\/\d{2})(\d)/, '$1/$2');
}

export function shiftMonth(period: string, offset: number) {
  const [year, month] = period.split('-').map(Number);
  return toLocalDateString(new Date(year, month - 1 + offset, 1)).slice(0, 7);
}
