export interface INoteItem {
   title: string;
   type: string;
   tags?: [];
   date: number;
   description?: string;
   key: string;
   formattedDescription?: string;
   status: taskStatus;
}

export type NewNoteFormData = {
   title: string;
   type: string;
   tags?: [];
   date: number;
   description?: string;
};

export type LoadRecentNotesResponse = {
   notes: INoteItem[] | null;
   limit: number;
};

export type taskStatus = 'completed' | 'active';

export type TaskType = 'Багфикс' | 'Учёба' | 'Идея' | 'Спорт' | 'Другое';
export type TagType = 'React' | 'TypeScript' | 'JavaScript' | 'C++' | 'C#' | 'Python' | 'Java' | 'Другое';