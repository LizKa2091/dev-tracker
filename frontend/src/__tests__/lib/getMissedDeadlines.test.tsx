import { describe, test, expect, vi, beforeEach } from 'vitest';
import { getMissedDeadlines } from '../../features/missed-deadline/model/getMissedDeadlines'
import { loadNotes } from '../../features/notes/model/noteStorage';
import dayjs from 'dayjs';

vi.mock('../../features/notes/model/noteStorage');

describe('getMissedDeadlines', () => {
   beforeEach(() => {
      vi.resetAllMocks();
   });

   test('returns null if there are no notes', () => {
      (loadNotes as any).mockReturnValue({ notes: [] });
      expect(getMissedDeadlines()).toBeNull();
   });

   test('returns null if there are no missed deadlines', () => {
      (loadNotes as any).mockReturnValue({
         notes: [
         { title: 'Upcoming', dueToDate: dayjs().add(1, 'day').toISOString() }
         ]
      });

      expect(getMissedDeadlines()).toBeNull();
   });

   test('returns missed deadlines', () => {
      const overdue = { title: 'Late task', dueToDate: dayjs().subtract(1, 'day').toISOString() };

      (loadNotes as any).mockReturnValue({
         notes: [
         overdue,
         { title: 'Upcoming', dueToDate: dayjs().add(1, 'day').toISOString() }
         ]
      });

      const result = getMissedDeadlines();
      expect(result).toEqual([overdue]);
   });
});
