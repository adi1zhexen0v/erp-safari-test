export function parseDate(value: string | null): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function normalizeDateToStartOfDay(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

export function normalizeDateToEndOfDay(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(23, 59, 59, 999);
  return normalized;
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export function matchesDateRange(
  date: Date | null,
  dateRange: DateRange,
  normalizeStart: (date: Date) => Date,
  normalizeEnd: (date: Date) => Date,
): boolean {
  if (!date) {
    return !dateRange.start && !dateRange.end;
  }

  if (dateRange.start && date < normalizeStart(dateRange.start)) {
    return false;
  }

  if (dateRange.end && date > normalizeEnd(dateRange.end)) {
    return false;
  }

  return true;
}
