import { describe, test, expect, vi, beforeEach } from 'vitest';
import dayjs from 'dayjs';
import { formatNotes } from './../../features/deadlines/lib/formatNotes';
import { type INoteItem } from '../../features/notes/noteTypes';

const mockToday = dayjs('2025-11-13');

vi.mock('dayjs', async (importOriginal) => {
   const actual: any = await importOriginal();

   return {
      __esModule: true,
      default: (date?: string | Date) =>
         date ? actual(date) : actual(mockToday.toISOString()), 
      ...actual,
   };
});

const makeNote = (overrides: Partial<INoteItem> = {}): INoteItem => ({
   key: 'k1',
   title: 'Test note',
   tags: [],
   status: 'active',
   createdDate: new Date().toISOString(),
   dueToDate: new Date().toISOString(),
   type: 'work',
   ...overrides,
});

describe('formatNotes tests', () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   test('return array of last 14 days if input is empty', () => {
      const result = formatNotes([]);

      expect(result).toHaveLength(14);

      const last = dayjs(result[result.length - 1].date);
      const first = dayjs(result[0].date);

      expect(last.diff(first, 'day')).toBe(13);

      for (let i = 1; i < result.length; i++) {
         const prev = dayjs(result[i - 1].date);
         const curr = dayjs(result[i].date);
         expect(curr.diff(prev, 'day')).toBe(1);
      }
   });

   test('counts amount of notes by their type for recent 14 days', () => {
      const notes: INoteItem[] = [
         makeNote({ dueToDate: mockToday.toISOString(), type: 'work' }),
         makeNote({ dueToDate: mockToday.toISOString(), type: 'study' }),
         makeNote({ dueToDate: mockToday.toISOString(), type: 'work' }),
         makeNote({ dueToDate: mockToday.clone().subtract(1, 'day').toISOString(), type: 'study' })
      ];

      const result = formatNotes(notes);

      const todayStr = mockToday.format('YYYY-MM-DD');
      const yesterdayStr = mockToday.clone().subtract(1, 'day').format('YYYY-MM-DD');

      const todayData = result.find(r => r.date === todayStr);
      const yesterdayData = result.find(r => r.date === yesterdayStr);

      expect(todayData).toEqual({ date: todayStr, work: 2, study: 1 });
      expect(yesterdayData).toEqual({ date: yesterdayStr, study: 1 });
   });

   test('returns data in chronological order', () => {
      const notes: INoteItem[] = [
         makeNote({ dueToDate: mockToday.clone().subtract(13, 'day').toISOString(), type: 'work' }),
         makeNote({ dueToDate: mockToday.toISOString(), type: 'study' })
      ];

      const result = formatNotes(notes);

      const first = dayjs(result[0].date);
      const last = dayjs(result[result.length - 1].date);

      expect(first.isBefore(last)).toBe(true);
      expect(first.diff(last, 'day')).toBe(-13);
   });
});
