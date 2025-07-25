import type { INoteItem, LoadRecentNotesResponse } from "../noteTypes";

interface INotesStorage {
   notes: INoteItem[] | null;
}

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

   const updatedNotes = savedNotes.map(note => note.key === noteData.key ? noteData : note);

   const notesToSave = {notes: updatedNotes};

   localStorage.setItem('notes', JSON.stringify(notesToSave));
   console.log(notesToSave);
   return notesToSave;
}