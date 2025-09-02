import { loadNotes } from "../../notes/model/noteStorage";
import dayjs from "dayjs";
import type { INoteItem } from "../../notes/noteTypes";

export const getIncomingDeadline = (): INoteItem | null => {
   const savedNotes = loadNotes().notes;

   if (!savedNotes || !savedNotes.length) return null;

   const today = dayjs();
   const twoDaysLater = today.add(2, 'day');

   const incomingDeadlines = savedNotes.filter((note => {
      if (note.status === 'completed') return false;

      return dayjs(note.dueToDate).isAfter(today) && dayjs(note.dueToDate).isBefore(twoDaysLater);
   }));

   if (!incomingDeadlines.length) return null;

   return incomingDeadlines.reduce((closest, curr) => (dayjs(curr.dueToDate).isBefore(dayjs(closest.dueToDate))) ? curr : closest);
};