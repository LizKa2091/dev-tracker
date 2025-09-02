import type { Dayjs } from "dayjs";
import type { ITagItem } from "../settings/ui/Tags/tagTypes";

export interface INoteItem {
   title: string;
   type: string;
   tags: ITagItem[];
   dueToDate: string;
   createdDate: string;
   description?: string;
   key: string;
   formattedDescription?: string;
   status: taskStatus;
}

export type NewNoteFormData = {
   title: string;
   type: string;
   tags?: ITagItem[];
   date: Dayjs;
   description?: string;
};

export type LoadRecentNotesResponse = {
   notes: INoteItem[] | null;
   limit: number;
};

export type taskStatus = 'completed' | 'active';

export type TaskType = 'Багфикс' | 'Учёба' | 'Идея' | 'Спорт' | 'Другое';
export type TagType = 'React' | 'TypeScript' | 'JavaScript' | 'C++' | 'C#' | 'Python' | 'Java' | 'Другое';