import type { DateKey, Weekday } from './models';

const pad = (n: number) => String(n).padStart(2, '0');

export function toDateKey(d: Date): DateKey {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function fromDateKey(key: DateKey): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function todayKey(now: Date = new Date()): DateKey {
  return toDateKey(now);
}

export function addDays(key: DateKey, days: number): DateKey {
  const d = fromDateKey(key);
  d.setDate(d.getDate() + days);
  return toDateKey(d);
}

/** Monday = 0 … Sunday = 6 */
export function weekdayOf(key: DateKey): Weekday {
  return ((fromDateKey(key).getDay() + 6) % 7) as Weekday;
}

/** The Monday of the week containing `key`. */
export function startOfWeek(key: DateKey): DateKey {
  return addDays(key, -weekdayOf(key));
}

export function weekDates(key: DateKey): DateKey[] {
  const monday = startOfWeek(key);
  return [0, 1, 2, 3, 4, 5, 6].map((i) => addDays(monday, i));
}

/** Inclusive list of dates from `from` to `to`. */
export function dateRange(from: DateKey, to: DateKey): DateKey[] {
  const out: DateKey[] = [];
  for (let k = from; k <= to; k = addDays(k, 1)) out.push(k);
  return out;
}

export function daysBetween(a: DateKey, b: DateKey): number {
  return Math.round((fromDateKey(b).getTime() - fromDateKey(a).getTime()) / 86_400_000);
}

export const WEEKDAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const WEEKDAY_LETTER = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
export const WEEKDAY_LONG = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "Tue, May 6" */
export function formatShortDate(key: DateKey): string {
  const d = fromDateKey(key);
  return `${WEEKDAY_SHORT[weekdayOf(key)]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

/** "May 6" */
export function formatMonthDay(key: DateKey): string {
  const d = fromDateKey(key);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

export function formatMonth(key: DateKey): string {
  return MONTHS[fromDateKey(key).getMonth()];
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  const h = d.getHours();
  return `${h % 12 === 0 ? 12 : h % 12}:${pad(d.getMinutes())} ${h < 12 ? 'AM' : 'PM'}`;
}

export function greetingFor(now: Date = new Date()): string {
  const h = now.getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}
