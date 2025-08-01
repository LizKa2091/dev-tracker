import type { INoteItem, LoadRecentNotesResponse } from "../noteTypes";
import type { INotesStorage } from "./constants";

export const saveNote = (noteData: INoteItem): INotesStorage => {
   const savedNotesData = loadNotes().notes ?? [];

   const notesToSave: INotesStorage = { notes: [...savedNotesData, noteData] };

   localStorage.setItem('notes', JSON.stringify(notesToSave));
   return notesToSave;
};

export const loadNotes = (): INotesStorage => {
   const notesData = localStorage.getItem('notes');

   return notesData ? JSON.parse(notesData) : { notes: null };
};

export const loadRecentNotes = (amount: number = 5): LoadRecentNotesResponse => {
   const notesData = loadNotes().notes;

   return { notes: notesData?.slice(-amount).reverse() ?? null, limit: notesData?.length ?? 0 };
};

export const updateNote = (noteData: INoteItem) => {
   const savedNotes = loadNotes().notes ?? [];

   const notesToSave = {notes: savedNotes.map(note => note.key === noteData.key ? noteData : note)};

   localStorage.setItem('notes', JSON.stringify(notesToSave));
   return notesToSave;
};

export const deleteNote = (noteKey: string): INoteItem[] => {
   const savedNotes = loadNotes().notes ?? [];
      
   const notesToSave = { notes: savedNotes.filter(note => note.key !== noteKey) };
   
   localStorage.setItem('notes', JSON.stringify(notesToSave));
   return notesToSave.notes;
};