import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import NoteItem from '../../shared/note-item/ui/NoteItem/NoteItem';
import { changeNoteStatus } from '../../shared/note-item/lib/changeNoteStatus';

vi.mock('../../shared/context/AuthContext', () => ({
   default: {
      useAuthContext: vi.fn(() => ({ token: '123' })),
   },
}));

vi.mock('../../shared/note-item/lib/changeNoteStatus', () => ({
   changeNoteStatus: vi.fn(),
}));

vi.mock('../../shared/note-item/model/useXpAction', () => ({
   useXpAction: vi.fn(() => ({ addXp: vi.fn() })),
}));

vi.mock('../../shared/note-item/model/useHealthAction', () => ({
   useHealthAction: vi.fn(() => ({ mutate: vi.fn() })),
}));

vi.mock('../../shared/notifications/model/useCompletedNoteNotification', () => ({
   useCompletedNoteNotification: vi.fn(() => ({ notifyCompletedNote: vi.fn() })),
}));

vi.mock('../UndoProgress/UndoProgress', () => ({
   default: ({ onComplete }: any) => (
      <button data-testid="undo" onClick={onComplete}>
         undo
      </button>
   ),
}));

const mockNote = {
   key: '1',
   title: 'Test title',
   description: 'Desc',
   type: 'daily',
   dueToDate: '2024-01-01',
   status: 'active',
   tags: [],
};

describe('NoteItem tests', () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   test('renders note title', () => {
      render(<NoteItem noteItemData={mockNote} handleDeleteNote={vi.fn()} />);

      expect(screen.getByText('Test title')).toBeInTheDocument();
   });

   test('delete button displays Вы уверены? text', () => {
      render(<NoteItem noteItemData={mockNote} handleDeleteNote={vi.fn()} />);

      const delButton = screen.getByText('Удалить');
      fireEvent.click(delButton);

      expect(screen.getByText('Вы уверены?')).toBeInTheDocument();
   });

   test('handleDeleteNote is called after confirmed deletion', () => {
      const mockDelete = vi.fn();
      render(<NoteItem noteItemData={mockNote} handleDeleteNote={mockDelete} />);

      fireEvent.click(screen.getByText('Удалить'));
      fireEvent.click(screen.getByText('Вы уверены?'));

      expect(mockDelete).toHaveBeenCalledWith('1');
   });

   test('button Пометить как выполненное updated status', () => {
      (changeNoteStatus as any).mockReturnValue('completed');

      render(<NoteItem noteItemData={mockNote} handleDeleteNote={vi.fn()} />);

      fireEvent.click(screen.getByText('Пометить как выполненное'));

      expect(changeNoteStatus).toHaveBeenCalledWith('1');
   });
});
