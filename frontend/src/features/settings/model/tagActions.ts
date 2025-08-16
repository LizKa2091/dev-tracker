import type { ITagItem } from "../tagTypes";

export const loadUserTags = (): ITagItem[] => {
   const savedTags: string | null = localStorage.getItem('userTags');

   if (savedTags) return JSON.parse(savedTags);
   
   return [];
};

export const updateUserTags = (tagName: string, color: string): ITagItem[] => {
   const savedTags = loadUserTags();

   if (savedTags.some(el => el.value === tagName)) {
      return savedTags;
   }

   const tagsToSave = [...savedTags, { label: tagName, value: tagName, color, key: tagName }];
   localStorage.setItem('userTags', JSON.stringify(tagsToSave));

   return tagsToSave;
};

export const deleteUserTag = (tagName: string): ITagItem[] => {
   const savedTags = loadUserTags();

   const tagsToSave = savedTags.filter(el => el.value !== tagName);

   if (tagsToSave.length !== savedTags.length) {
      localStorage.setItem('userTags', JSON.stringify(tagsToSave));
   }

   return tagsToSave;
};