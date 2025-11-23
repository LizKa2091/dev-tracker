import { beforeEach, describe, expect, test } from 'vitest';
import { filterNotesByDate } from '../../features/timeline/model/filterNotesByDate';
import dayjs from 'dayjs';

describe('filterNotesByDate tests', () => {
   beforeEach(() => {
      localStorage.clear();
   });

   test('returns empty array if unknown segment', () => {
      expect(filterNotesByDate('unknown')).toEqual([]);
   });

   test('returns empty array if localStorage is empty', () => {
      expect(filterNotesByDate('day')).toEqual([]);
   });

   test('filters day notes', () => {
      const now = dayjs();
      const older = now.subtract(2, 'day');

      localStorage.setItem(
         'notes',
         JSON.stringify({
         notes: [
            { key: '1', title: 'A', createdDate: now.toISOString() },
            { key: '2', title: 'B', createdDate: older.toISOString() },
         ],
         }),
      );

      const result = filterNotesByDate('day');
      expect(result.length).toBe(1);
   });
});
