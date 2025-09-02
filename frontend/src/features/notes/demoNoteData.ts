import type { INoteItem } from "./noteTypes";

export const demoNoteData: INoteItem[] = [{
   title: 'Первая заметка',
   type: 'Идея',
   tags: [],
   createdDate: "2025-08-20T21:00:00.000Z",
   dueToDate: "2025-08-26T21:00:00.000Z",
   description: 'Мой первый код ```console.log("hello world")``` выводит hello world',
   formattedDescription: "Мой первый код <pre class=\"code-block\"><code><span>console.log(\"hello world\")</span></code></pre> выводит hello world",
   key: '1756242000000159',
   status: 'active'
}]