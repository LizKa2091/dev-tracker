import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import NewNoteForm from '../../features/notes/ui/NewNoteForm/NewNoteForm';
import { saveNote } from '../../features/notes/model/noteStorage';

vi.mock('../../features/notes/model/noteStorage', () => ({
   saveNote: vi.fn()
}));

vi.mock('../../features/settings/model/tagActions', () => ({
   loadUserTags: vi.fn().mockReturnValue([])
}));

vi.mock('../../shared/context/AuthContext', () => ({
   default: {
      useAuthContext: () => ({ token: 'TOKEN' })
   }
}));

vi.mock('../../shared/markdown-textarea/ui/ui/MarkdownTextarea', () => ({
   default: (props: any) => (
      <textarea
         data-testid="markdown-input"
         onChange={e => props.onChange?.(e)}
         onInput={e => props.onFormattedChange?.((e.target as HTMLTextAreaElement).value)}
      />
   )
}));

vi.mock('../../features/notes/ui/TagSelect/TagSelect', () => ({
   default: (props: any) => (
      <select
         data-testid="tag-select"
         multiple
         onChange={e => props.onChange([...e.target.selectedOptions].map(o => o.value))}
      />
   )
}));

vi.mock('antd', async () => {
   const actual = await vi.importActual<any>('antd');

   const Form = (props: any) => (
      <form onSubmit={(e) => {
         e.preventDefault();
         props.onFinish?.(props.initialValues);
      }}>
         {props.children}
      </form>
   );
   Form.Item = (props: any) => <div>{props.children}</div>;

   return {
      ...actual,
      Form,
      Input: (props: any) => (
         <input
            data-testid={props['data-testid']}
            disabled={props.disabled}
            value={props.value}
            onChange={props.onChange}
         />
      ),
      Select: (props: any) => (
         <select
            data-testid={props['data-testid']}
            disabled={props.disabled}
            value={props.value}
            onChange={e => props.onChange?.(e.target.value)}
         >
         <option value="task">task</option>
         <option value="note">note</option>
         </select>
      ),
      DatePicker: (props: any) => {
         const handleChange = (e: any) => {
            props.onChange?.({
               format: () => e.target.value
            });
         };
         return <input type="date" data-testid={props['data-testid']} disabled={props.disabled} onChange={handleChange} />;
      },
      Button: (props: any) => (
         <button
            data-testid={props['data-testid']}
            type={props.htmlType || 'button'}
            disabled={props.disabled}
            onClick={props.onClick}
         >
            {props.children}
         </button>
      ),
   };
});


describe('NewNoteForm tests', () => {
   const mockSave = saveNote as unknown as ReturnType<typeof vi.fn>;
   let setIsNoteSaved: any;

   beforeEach(() => {
      mockSave.mockReset();
      setIsNoteSaved = vi.fn();
   });

   test('successful note save calls saveNote', async () => {
      mockSave.mockReturnValue({ notes: [{}] });

      render(<NewNoteForm isNoteSaved={false} setIsNoteSaved={setIsNoteSaved} />);

      fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'Test note' } });
      fireEvent.change(screen.getByTestId('type-select'), { target: { value: 'task' } });
      fireEvent.change(screen.getByTestId('date-input'), { target: { value: '2024-01-01' } });

      fireEvent.click(screen.getByTestId('submit-btn'));

      await waitFor(() => {
         expect(mockSave).toHaveBeenCalled();
         expect(setIsNoteSaved).toHaveBeenCalledWith(true);
      });
   });

   test('displays success save message', () => {
      render(<NewNoteForm isNoteSaved={true} setIsNoteSaved={setIsNoteSaved} />);
      expect(screen.getByText('Запись успешно сохранена')).toBeInTheDocument();
   });
});
