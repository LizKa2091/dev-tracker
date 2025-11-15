import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import dayjs from 'dayjs';
import { useCellsGrid } from './../../features/activity-cells/model/useCellsGrid';
import { type ICellItemData } from '../../features/activity-cells/activityCellTypes';

describe('useCellsGrid tests', () => {
   beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-05-15T12:00:00Z'));
   });

   afterEach(() => {
      vi.useRealTimers();
   });

   test('return empty weeks if cellItems is empty', () => {
      const result = useCellsGrid([], 2025);
      expect(result).toEqual({ weeks: [] });
   });

   test('creates correct weeks amount for not empty data', () => {
      const start = dayjs('2025-01-01');
      const end = dayjs('2025-05-15');

      const daysCount = end.diff(start, 'day') + 1;
      const cellItems: ICellItemData[] = Array.from({ length: daysCount }, (_, i) => ({
         day: start.add(i, 'day').toISOString(),
         activities: i % 5 === 0 ? 3 : 0,
      }));

      const { weeks, maxActivities } = useCellsGrid(cellItems, 2025);

      expect(weeks.length).toBeGreaterThan(15);
      expect(maxActivities).toBe(3);

      for (const week of weeks) {
         expect(week.days).toHaveLength(7);
         expect(week.days.every(d => d.day && typeof d.isHidden === 'boolean')).toBe(true);
      }
   });

   test('marks last year and future days as hidden', () => {
      const prevYearDayStr = '2024-12-31T00:00:00Z';
      const today = dayjs('2025-05-15T00:00:00Z');
      const futureDayStr = today.add(3, 'day').toISOString();

      const cellItems: ICellItemData[] = [
         { day: prevYearDayStr, activities: 2 },
         { day: '2025-01-01T00:00:00Z', activities: 3 },
         { day: futureDayStr, activities: 1 },
      ];

      const { weeks } = useCellsGrid(cellItems, 2025);

      const allDays = weeks.flatMap(w => w.days);

      const prevYearDay = allDays.find(d => d.day === dayjs(prevYearDayStr).format('YYYY-MM-DD'));
      const newYearDay = allDays.find(d => d.day === '2025-01-01');
      const futureDay = allDays.find(d => d.day === dayjs(futureDayStr).format('YYYY-MM-DD'));

      expect(prevYearDay?.isHidden).toBe(true);
      expect(newYearDay?.isHidden).toBe(false);
      expect(futureDay?.isHidden).toBe(true);
  });

   test('marks monthLabel only if there is month start of the week', () => {
      const start = dayjs('2025-01-01');
      const cellItems: ICellItemData[] = Array.from({ length: 40 }, (_, i) => ({
         day: start.add(i, 'day').toISOString(),
         activities: 1,
      }));

      const { weeks } = useCellsGrid(cellItems, 2025);

      const labeledWeeks = weeks.filter(w => w.monthLabel);

      expect(labeledWeeks.some(w => w.monthLabel === 'Jan')).toBe(true);
      expect(labeledWeeks.some(w => w.monthLabel === 'Feb')).toBe(true);
   });

   test('calculates maxActivities even if total activities are 0', () => {
      const cellItems: ICellItemData[] = [
         { day: '2025-01-01T00:00:00Z', activities: 0 },
         { day: '2025-01-02T00:00:00Z', activities: 0 },
      ];

      const { maxActivities } = useCellsGrid(cellItems, 2025);
      expect(maxActivities).toBe(0);
   });
});
