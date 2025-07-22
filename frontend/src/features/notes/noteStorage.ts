import type { INoteItem } from "./noteTypes";

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