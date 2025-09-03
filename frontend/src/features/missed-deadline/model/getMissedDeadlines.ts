import dayjs from "dayjs";
import { loadNotes } from "../../notes/model/noteStorage";
import type { INoteItem } from "../../notes/noteTypes";

export const getMissedDeadlines = (): INoteItem[] | null => {
   const savedNotes = loadNotes();

   if (!savedNotes.notes || !savedNotes.notes.length) return null;

   const today = dayjs();
   
   const missedNotes = savedNotes.notes.filter((note: INoteItem) => {
      if (dayjs(note.dueToDate).isBefore(today)) return note;
   });

   if (!missedNotes.length) return null;

   return missedNotes;
};