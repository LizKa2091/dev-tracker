import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import MarkdownTextarea from '../../shared/markdown-textarea/ui/ui/MarkdownTextarea';
import { formatMarkdownDesc } from '../../shared/lib/markdown/formatMarkdownDesc';

vi.mock('../../shared/lib/hooks/useDebounce', () => ({
   default: (v: string) => v
}));

describe('MarkdownTextarea tests', () => {
   test('displays textarea on focus', () => {
      render(<MarkdownTextarea value="test" onChange={() => {}} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
   });

   test('formats markdown and displays html block', () => {
      const markdown = '`code`';
      render(<MarkdownTextarea value={markdown} onChange={() => {}} />);

      const formatted = formatMarkdownDesc(markdown);

      expect(screen.getByText('code')).toBeInTheDocument();
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
   });

   test('calls onChange on text update', () => {
      const onChange = vi.fn();

      render(<MarkdownTextarea value="" onChange={onChange} />);

      const textarea = screen.getByRole('textbox');

      fireEvent.change(textarea, { target: { value: 'hello' } });

      expect(onChange).toHaveBeenCalledWith('hello');
   });

   test('calls onFormattedChange', () => {
      const onFormatted = vi.fn();

      render(
         <MarkdownTextarea
            value="`test`"
            onChange={() => {}}
            onFormattedChange={onFormatted}
         />
      );

      expect(onFormatted).toHaveBeenCalled();
   });

   test('click on html block turns on textarea mode', () => {
      const markdown = '`a`';
      render(<MarkdownTextarea value={markdown} onChange={() => {}} />);

      const codeBlock = screen.getByText('a');
      fireEvent.click(codeBlock);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
   });
});
