import type { INoteItem } from "../../../../features/notes/noteTypes";

// 1 commit implement change note status function

export const changeNoteStatus = (noteKey: string): string | void => {
    const savedNotes: string | null = localStorage.getItem('notes');

    if (!savedNotes) return;

    const noteItems: INoteItem[] = JSON.parse(savedNotes).notes;
    const currNote: INoteItem[] = noteItems.filter(currItem => currItem.key === noteKey);
    
    const newStatus = currNote[0].status === 'completed' ? 'active' : 'completed';
    currNote[0].status = newStatus;
    
    const notesToSave = { notes: [...noteItems.filter(note => note.key !== noteKey), ...currNote] };
    
    localStorage.setItem('notes', JSON.stringify(notesToSave));

    return newStatus;
};