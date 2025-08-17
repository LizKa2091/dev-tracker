import { tagOptions } from "./constants";

export const initTags = (): void => {
   const savedTags: string | null = localStorage.getItem('userTags');

   if (!savedTags) {
      localStorage.setItem('userTags', JSON.stringify(tagOptions));
   }
};