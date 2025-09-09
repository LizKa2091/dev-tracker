import type { INoteItem } from "../../notes/noteTypes";
import dayjs from 'dayjs';

dayjs().format()

export const filterByDate = (segment: string): INoteItem[] => {
   let destinDay: dayjs.Dayjs;

   switch (segment) {
      case 'day':
         destinDay = dayjs().subtract(1, 'day');
         break;
      case 'week':
         destinDay = dayjs().subtract(7, 'day');
         break;
      case 'month':
         destinDay = dayjs().subtract(30, 'day');
         break;
      case 'year':
         destinDay = dayjs().subtract(365, 'day');
         break;
      default:
         return [];
   }

   const savedNotes = localStorage.getItem('notes');
   if (!savedNotes) return [];

   const filteredNotes: INoteItem[] = JSON.parse(savedNotes).notes.filter((note: INoteItem) => dayjs(note.createdDate).isAfter(destinDay));

   return filteredNotes;
};