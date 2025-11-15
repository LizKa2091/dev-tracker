import { describe, test, expect, vi, beforeEach } from 'vitest';
import { getIncomingDeadline } from './../../features/incoming-deadline/lib/getIncomingDeadline';
import { loadNotes } from '../../features/notes/model/noteStorage';
import dayjs from 'dayjs';
import { type INoteItem } from '../../features/notes/noteTypes';

vi.mock('../../features/notes/model/noteStorage', () => ({
  loadNotes: vi.fn(),
}));

describe('getIncomingDeadline tests', () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   test('returns null if there are no saved notes', () => {
      (loadNotes as any).mockReturnValue({ notes: [] });

      const result = getIncomingDeadline();
      expect(result).toBeNull();
   });

   test('ignores finished notes', () => {
      const notes: INoteItem[] = [
         { title: 'Task 1', dueToDate: dayjs().add(1, 'day').toISOString(), status: 'completed', key: '1', createdDate: '', tags: [], type: 'work' },
         { title: 'Task 2', dueToDate: dayjs().add(1, 'day').toISOString(), status: 'completed', key: '2', createdDate: '', tags: [], type: 'home' },
      ];
      (loadNotes as any).mockReturnValue({ notes });

      const result = getIncomingDeadline();
      expect(result).toBeNull();
   });

   test('returns incoming deadline in 2 days range', () => {
      const notes: INoteItem[] = [
         { title: 'Task 1', dueToDate: dayjs().add(1, 'day').toISOString(), status: 'pending', key: '1', createdDate: '', tags: [], type: 'work' },
         { title: 'Task 2', dueToDate: dayjs().add(1, 'day').add(2, 'hour').toISOString(), status: 'pending', key: '2', createdDate: '', tags: [], type: 'home' },
      ];
      (loadNotes as any).mockReturnValue({ notes });

      const result = getIncomingDeadline();
      expect(result).toEqual(notes[0]);
   });

   test('ignores deadlines after 2 days', () => {
      const notes: INoteItem[] = [
         { title: 'Task 1', dueToDate: dayjs().add(3, 'day').toISOString(), status: 'pending', key: '1', createdDate: '', tags: [], type: 'work' },
         { title: 'Task 2', dueToDate: dayjs().subtract(1, 'day').toISOString(), status: 'pending', key: '2', createdDate: '', tags: [], type: 'home' },
      ];
      (loadNotes as any).mockReturnValue({ notes });

      const result = getIncomingDeadline();
      expect(result).toBeNull();
   });
});
