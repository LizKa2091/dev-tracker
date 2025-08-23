import type { INoteItem } from "../../notes/noteTypes";
import type { IChartDataItem } from "../deadlineNoteTypes";
import dayjs from 'dayjs';

export const formatNotes = (notesData: INoteItem[]): IChartDataItem[] => {
   const today = dayjs();
   const fourteenDaysAgo = today.subtract(13, 'day');

   const dateMap = new Map<string, { [type: string]: number }>();

   for (let i=0; i<14; i++) {
      const dateStr = today.subtract(i, 'day').format('YYYY-MM-DD');
      dateMap.set(dateStr, {});
   }

   notesData.forEach(note => {
      const noteDate = dayjs(note.date);
      
      if (noteDate.isBefore(fourteenDaysAgo) || noteDate.isAfter(today)) return;

      const dateStr = noteDate.format('YYYY-MM-DD');
      const dayEntry = dateMap.get(dateStr)!;

      if (dayEntry[note.type]) dayEntry[note.type] += 1;
      else dayEntry[note.type] = 1;
   });

   const chartData: IChartDataItem[] = Array.from(dateMap.entries()).map(([date, typesObj]) => ({ date, ...typesObj })).reverse();

   return chartData;
};