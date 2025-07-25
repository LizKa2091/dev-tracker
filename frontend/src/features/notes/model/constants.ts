import type { TagType, TaskType } from "../noteTypes";

interface IOptions {
   value: TaskType | TagType;
   label: TaskType | TagType;
};

export const typeOptions: IOptions[] = [
   { value: 'Багфикс', label: 'Багфикс' },
   { value: 'Учёба', label: 'Учёба' },
   { value: 'Идея', label: 'Идея' },
   { value: 'Спорт', label: 'Спорт' },
   { value: 'Другое', label: 'Другое' },
];

export const tagOptions: IOptions[] = [
   { value: 'React', label: 'React' },
   { value: 'TypeScript', label: 'TypeScript' },
   { value: 'JavaScript', label: 'JavaScript' },
   { value: 'C++', label: 'C++' },
   { value: 'C#', label: 'C#' },
   { value: 'Python', label: 'Python' },
   { value: 'Java', label: 'Java' },
   { value: 'Другое', label: 'Другое' },
];