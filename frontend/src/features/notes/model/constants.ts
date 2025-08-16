import type { INoteItem, TagType, TaskType } from "../noteTypes";

interface ITypeOptions {
   value: TaskType | TagType;
   label: TaskType | TagType;
};

interface ITagOptions {
   value: TaskType | TagType;
   label: TaskType | TagType;
   color: string;
   key: string;
};

export const typeOptions: ITypeOptions[] = [
   { value: 'Багфикс', label: 'Багфикс' },
   { value: 'Учёба', label: 'Учёба' },
   { value: 'Идея', label: 'Идея' },
   { value: 'Спорт', label: 'Спорт' },
   { value: 'Другое', label: 'Другое' },
];

export const tagOptions: ITagOptions[] = [
   { value: 'React', label: 'React', color: '#61dafb', key: 'React' },
   { value: 'TypeScript', label: 'TypeScript', color: '#3178c6', key: 'TypeScript' },
   { value: 'JavaScript', label: 'JavaScript', color: '#f7df1e', key: 'JavaScript' },
   { value: 'C++', label: 'C++', color: '#00599c', key: 'C++' },
   { value: 'C#', label: 'C#', color: '#68217a', key: 'C#' },
   { value: 'Python', label: 'Python', color: '#3776ab', key: 'Python' },
   { value: 'Java', label: 'Java', color: '#f89820', key: 'Java' },
   { value: 'Другое', label: 'Другое', color: '#888888', key: 'Другое' },
];

export interface INotesStorage {
   notes: INoteItem[] | null;
}