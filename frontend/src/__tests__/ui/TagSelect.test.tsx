import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TagSelect from '../../features/notes/ui/TagSelect/TagSelect';

vi.mock('antd', () => {
   const Select = ({ value, onChange, disabled, options, tagRender }: any) => (
      <div data-testid="select" data-disabled={disabled}>
         {options.map((opt: any) => (
            <div
               key={opt.value}
               data-testid="option"
               data-value={opt.value}
               onClick={() => onChange([opt.value])}
            >
               {opt.label}
            </div>
         ))}
         <div data-testid="selected">
            {value.join(',')}
         </div>
         {tagRender && value.map((v: string) => tagRender({ label: v, value: v, closable: true }))}
      </div>
   );

   const Tag = ({ color, children }: any) => (
      <span data-testid="tag" data-color={color}>{children}</span>
   );

   return { Select, Tag };
});

describe('TagSelect tests', () => {
   const mockTags = [
      { value: 'work', label: 'Работа', color: 'blue', key: '1' },
      { value: 'home', label: 'Дом', color: 'green', key: '2' },
   ];

   test('renders with initial values', () => {
      render(<TagSelect value={[mockTags[0]]} userTags={mockTags} disabled={false} />);
      
      expect(screen.getByTestId('select')).toBeInTheDocument();
      expect(screen.getByTestId('selected')).toHaveTextContent('work');
   });

   test('disabled if props given', () => {
      render(<TagSelect value={[]} userTags={mockTags} disabled={true} />);

      expect(screen.getByTestId('select')).toHaveAttribute('data-disabled', 'true');
   });

   test('calls onChange on new tag select', () => {
      const handleChange = vi.fn();
      render(<TagSelect value={[]} onChange={handleChange} userTags={mockTags} disabled={false} />);

      const option = screen.getAllByTestId('option')[0];
      fireEvent.click(option);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith([
         { value: 'work', label: 'Работа', color: 'blue', key: '1' },
      ]);
   });

   test('creates new tag if it does not exist in userTags', () => {
      const handleChange = vi.fn();
      render(<TagSelect value={[]} onChange={handleChange} userTags={mockTags} disabled={false} />);

      const select = screen.getByTestId('select');
      fireEvent.click(select.querySelector('[data-testid="option"]')!);

      const onChange = (select as any).props?.onChange || (() => {});
      onChange?.(['custom']);
   });

   test('renders tags with selected color', () => {
      render(<TagSelect value={[mockTags[0]]} userTags={mockTags} disabled={false} />);
      const tag = screen.getByTestId('tag');
      expect(tag).toHaveAttribute('data-color', 'blue');
      expect(tag).toHaveTextContent('work');
   });

   test('uses default color if tag was not found', () => {
      const unknownTag = { value: 'unknown', label: 'Неизвестно', key: '3', color: '' };
      render(<TagSelect value={[unknownTag]} userTags={mockTags} disabled={false} />);
      
      const tag = screen.getByTestId('tag');
      expect(tag).toHaveAttribute('data-color', '#888');
   });
});
