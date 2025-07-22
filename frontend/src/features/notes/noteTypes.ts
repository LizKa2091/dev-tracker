export interface INoteItem {
   title: string;
   type: string;
   tags?: [];
   date: number;
   description?: string;
}

export type NewNoteFormData = {
   title: string;
   type: string;
   tags?: [];
   date: number;
   description?: string;
};

export type TaskType = 'Багфикс' | 'Учёба' | 'Идея' | 'Спорт' | 'Другое';
export type TagType = 'React' | 'TypeScript' | 'JavaScript' | 'C++' | 'C#' | 'Python' | 'Java' | 'Другое';