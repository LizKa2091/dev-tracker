import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NewNote from '../../features/notes/ui/NewNote/NewNote';

vi.mock('../../features/notes/ui/NewNoteForm/NewNoteForm', () => ({
   default: ({ isNoteSaved }: { isNoteSaved: boolean }) => (
      <div data-testid="new-note-form">
         NewNoteForm - {isNoteSaved ? 'saved' : 'not saved'}
      </div>
   ),
}));

vi.mock('../../features/notes/ui//RecentNotes/RecentNotes', () => ({
   default: ({ isNoteSaved }: { isNoteSaved: boolean }) => (
      <div data-testid="recent-notes">
         RecentNotes - {isNoteSaved ? 'saved' : 'not saved'}
      </div>
   ),
}));

describe('NewNote tests', () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   test('renders with button and notes list', () => {
      render(<NewNote />);

      expect(screen.getByRole('button', { name: 'Добавить запись' })).toBeInTheDocument();
      expect(screen.getByTestId('recent-notes')).toBeInTheDocument();
   });

   test('form is hidden by default', () => {
      render(<NewNote />);

      const formContainer = screen.getByTestId('new-note-form').parentElement;
      expect(formContainer?.className).toMatch(/hidden/);
   });

   test('on click on button form displays and button changes the text', () => {
      render(<NewNote />);

      const button = screen.getByRole('button', { name: 'Добавить запись' });

      fireEvent.click(button);

      expect(screen.getByRole('button', { name: 'Скрыть' })).toBeInTheDocument();

      const formContainer = screen.getByTestId('new-note-form').parentElement;
      expect(formContainer?.className).toMatch(/active/);
   });

   test('gives flag isNoteSaved to children', () => {
      render(<NewNote />);

      expect(screen.getByText(/NewNoteForm - not saved/i)).toBeInTheDocument();
      expect(screen.getByText(/RecentNotes - not saved/i)).toBeInTheDocument();
   });
});
