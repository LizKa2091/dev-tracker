import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import EditField from '../../shared/note-item/ui/EditField/EditField';
import { updateNote } from '../../features/notes/model/noteStorage';

vi.mock('../../features/notes/model/noteStorage', () => ({
   updateNote: vi.fn(),
}));

const mockNote = {
   key: '1',
   title: 'Title',
   description: 'Desc',
   formattedDescription: '',
   dueToDate: '2024-01-01',
};

describe('EditField', () => {
   beforeEach(() => vi.clearAllMocks());

   test('saves edited field', () => {
      const onSave = vi.fn();

      render(
         <EditField value="Text" field="title" note={mockNote} onSave={onSave} />
      );

      fireEvent.click(screen.getByRole('button'));

      fireEvent.change(screen.getByDisplayValue('Text'), {
         target: { value: 'New text' },
      });

      const saveBtn = screen.getByRole('button', { name: /check/i });
      fireEvent.click(saveBtn);

      expect(updateNote).toHaveBeenCalled();
      expect(onSave).toHaveBeenCalledWith(
         expect.objectContaining({ title: 'New text' })
      );
   });

   test('cancellation returns previous value', () => {
      render(
         <EditField value="Text" field="title" note={mockNote} onSave={vi.fn()} />
      );

      fireEvent.click(screen.getByRole('button'));

      fireEvent.change(screen.getByDisplayValue('Text'), {
         target: { value: 'Changed' },
      });

      const cancelBtn = screen.getByRole('button', { name: /close/i });
      fireEvent.click(cancelBtn);

      expect(screen.queryByDisplayValue('Changed')).not.toBeInTheDocument();
   });
});
