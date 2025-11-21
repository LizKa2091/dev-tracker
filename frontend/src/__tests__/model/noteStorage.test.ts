import { describe, test, expect, beforeEach } from 'vitest';
import { saveNote, loadNotes, loadRecentNotes, updateNote, deleteNote } from '../../features/notes/model/noteStorage';
import { INoteItem } from '../../features/notes/noteTypes';

describe('noteStorage tests', () => {
   beforeEach(() => {
      localStorage.clear();
   });

   const note: INoteItem = {
      key: '1',
      title: 'Test',
      type: 'task',
      tags: [],
      dueToDate: '2024-01-01',
      createdDate: '2024-01-01',
      description: '',
      formattedDescription: '',
      status: 'active' as const
   };

   test('saveNote saves note', () => {
      const res = saveNote(note);
      expect(res.notes.length).toBe(1);

      const saved = JSON.parse(localStorage.getItem('notes')!);
      expect(saved.notes[0]).toEqual(note);
   });

   test('loadNotes returns null if there is no data', () => {
      expect(loadNotes()).toEqual({ notes: null });
   });

   test('loadRecentNotes returns recent notes', () => {
      saveNote({ ...note, key: '1' });
      saveNote({ ...note, key: '2' });
      saveNote({ ...note, key: '3' });

      const recent = loadRecentNotes(2);
      expect(recent.notes!.length).toBe(2);
      expect(recent.notes![0].key).toBe('3');
      expect(recent.notes![1].key).toBe('2');
   });

   test('updateNote updates note', () => {
      saveNote(note);

      const updated = { ...note, title: 'Updated' };
      updateNote(updated);

      const loaded = loadNotes().notes!;
      expect(loaded[0].title).toBe('Updated');
   });

   test('deleteNote deletes note', () => {
      saveNote(note);
      saveNote({ ...note, key: '2' });

      const res = deleteNote('1');

      expect(res.length).toBe(1);
      expect(res[0].key).toBe('2');
   });
});
