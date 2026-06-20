import { Dayjs } from 'dayjs';

export function buildCalendarDays(month: Dayjs): (Dayjs | null)[] {
  const firstDay = month.startOf('month');
  const daysInMonth = month.daysInMonth();
  const startDow = firstDay.day(); // 0=Sunday
  const cells: (Dayjs | null)[] = [];
  for (let i = 0; i < 42; i++) {
    const idx = i - startDow;
    cells.push(idx < 0 || idx >= daysInMonth ? null : firstDay.add(idx, 'day'));
  }
  return cells;
}
