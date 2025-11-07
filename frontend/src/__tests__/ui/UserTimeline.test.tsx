import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import UserTimeline from '../../features/timeline/ui/UserTimeline/UserTimeline';

vi.mock('antd', async () => {
   const actual = await vi.importActual<typeof import('antd')>('antd');

   return {
      ...actual,
      Flex: ({ children }: any) => <div>{children}</div>,
      Button: ({ onClick, children }: any) => (
         <button onClick={onClick}>{children}</button>
      ),
      Segmented: ({ options, value, onChange }: any) => (
         <select
            data-testid="segmented"
            value={value}
            onChange={(e) => onChange(e.target.value)}
         >
            {options.map((opt: any) => (
               <option key={opt.value} value={opt.value}>
                  {opt.label}
               </option>
            ))}
         </select>
      ),
   };
});

vi.mock('../../features/timeline/model/filterNotesByDate', () => ({
   filterNotesByDate: vi.fn(),
}));

vi.mock('../../features/notes/model/noteStorage', () => ({
   deleteNote: vi.fn(),
}));

vi.mock('../../features/timeline/ui/GithubTimeline/GithubTimeline', () => ({
   __esModule: true,
   default: ({ segment }: any) => (
      <div data-testid="github-timeline">GithubTimeline: {segment}</div>
   ),
}));

vi.mock('../../shared/note-item/ui/NoteItem/NoteItem', () => ({
   __esModule: true,
   default: ({ noteItemData, handleDeleteNote }: any) => (
      <div data-testid="note-item">
         {noteItemData.title}
         <button onClick={() => handleDeleteNote(noteItemData.key)}>Удалить</button>
      </div>
   ),
}));

const { filterNotesByDate } = await import('../../features/timeline/model/filterNotesByDate');
const { deleteNote } = await import('../../features/notes/model/noteStorage');

describe('UserTimeline tests', () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   test('renders header, segment, button', () => {
      (filterNotesByDate as any).mockReturnValue([]);

      render(<UserTimeline />);

      expect(screen.getByText('Недавно созданные задачи')).toBeInTheDocument();
      expect(screen.getByTestId('segmented')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Скрыть Github коммиты' })).toBeInTheDocument();
   });

   test('displays GithubTimeline by default and hides on click', () => {
      (filterNotesByDate as any).mockReturnValue([]);
      render(<UserTimeline />);

      expect(screen.getByTestId('github-timeline')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'Скрыть Github коммиты' }));

      expect(screen.queryByTestId('github-timeline')).toBeNull();
   });

   test('calls filterNotesByDate on mount and on segment change', () => {
      (filterNotesByDate as any).mockReturnValue([]);
      render(<UserTimeline />);

      expect(filterNotesByDate).toHaveBeenCalledWith('day');

      fireEvent.change(screen.getByTestId('segmented'), { target: { value: 'month' } });
      expect(filterNotesByDate).toHaveBeenCalledWith('month');
   });

   test('renders NoteItem for each note', () => {
      (filterNotesByDate as any).mockReturnValue([
         { key: '1', title: 'Note 1' },
         { key: '2', title: 'Note 2' },
      ]);

      render(<UserTimeline />);

      const notes = screen.getAllByTestId('note-item');

      expect(notes).toHaveLength(2);
      expect(screen.getByText('Note 1')).toBeInTheDocument();
      expect(screen.getByText('Note 2')).toBeInTheDocument();
   });

   test('deletes note on clicking "Удалить"', () => {
      const mockNotes = [{ key: '1', title: 'Note 1' }];
      (filterNotesByDate as any).mockReturnValue(mockNotes);
      (deleteNote as any).mockReturnValue([]);

      render(<UserTimeline />);

      fireEvent.click(screen.getByText('Удалить'));

      expect(deleteNote).toHaveBeenCalledWith('1');
   });
});
