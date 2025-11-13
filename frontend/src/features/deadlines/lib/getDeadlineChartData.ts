import { loadNotes } from "../../notes/model/noteStorage";
import { formatNotes } from "./formatNotes";
import type { INotesStorage } from "../../notes/model/constants";
import type { IChartDataItem } from "../deadlineNoteTypes";

interface getDeadlineChartData {
   chartData: IChartDataItem[] | null;
   types: string[];
}

export const getDeadlineChartData = (): getDeadlineChartData => {
   const savedNotes: INotesStorage = loadNotes();

   if (!savedNotes) return { chartData: null, types: [] };

   const formattedNotes = formatNotes(savedNotes.notes!);
   const seenTypes = new Set<string>();

   formattedNotes.forEach(item => {
      Object.keys(item).forEach(key => {
         if (key !== 'date') seenTypes.add(key);
      });
   });

   return { chartData: formattedNotes, types: Array.from(seenTypes) };
}