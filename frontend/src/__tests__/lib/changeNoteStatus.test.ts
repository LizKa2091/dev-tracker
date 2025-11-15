import { describe, test, expect, vi, beforeEach } from 'vitest';
import { changeNoteStatus } from '../../shared/note-item/lib/changeNoteStatus';
import dayjs from 'dayjs';

const mockNotes = {
   notes: [
      {
         key: '1',
         title: 'Test',
         tags: [],
         createdDate: '',
         type: 'work',
         status: 'active',
         dueToDate: '2025-01-01',
      }
   ]
};

describe('changeNoteStatus tests', () => {
   beforeEach(() => {
      vi.clearAllMocks();
      global.localStorage.setItem('notes', JSON.stringify(mockNotes));
   });

   test('returns undefined if there are no notes', () => {
      global.localStorage.removeItem('notes');

      expect(changeNoteStatus('1')).toBeUndefined();
   });

   test('changes status from active to completed', () => {
      const result = changeNoteStatus('1');
      const saved = JSON.parse(global.localStorage.getItem('notes')!);

      expect(result).toBe('completed');
      expect(saved.notes[0].status).toBe('completed');
      expect(dayjs(saved.notes[0].completedDate).isValid()).toBe(true);
   });

   test('changes status from completed to active', () => {
      const modified = {
         notes: [{ ...mockNotes.notes[0], status: 'completed' }]
      };
      localStorage.setItem('notes', JSON.stringify(modified));

      const result = changeNoteStatus('1');

      const saved = JSON.parse(localStorage.getItem('notes')!);

      expect(result).toBe('active');
      expect(saved.notes[0].status).toBe('active');
   });
});
