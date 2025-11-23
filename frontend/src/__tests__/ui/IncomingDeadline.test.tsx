import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import IncomingDeadline from '../../features/incoming-deadline/ui/IncomingDeadline'
import { getIncomingDeadline } from '../../features/incoming-deadline/lib/getIncomingDeadline';
import AuthExports from '../../shared/context/AuthContext';
import dayjs from 'dayjs';

vi.mock('../../features/incoming-deadline/lib/getIncomingDeadline');
vi.mock('../../shared/context/AuthContext', () => ({
   default: {
      useAuthContext: vi.fn()
   }
}));

describe('IncomingDeadline tests', () => {
   beforeEach(() => {
      vi.resetAllMocks();
   });

   test('does not renders if there is no deadline', () => {
      (AuthExports.useAuthContext as any).mockReturnValue({ isAuthed: true });
      (getIncomingDeadline as any).mockReturnValue(null);

      const { container } = render(<IncomingDeadline />);
      expect(container.firstChild).toBeNull();
   });

   test('renders deadline if it exists', () => {
      (AuthExports.useAuthContext as any).mockReturnValue({ isAuthed: true });

      (getIncomingDeadline as any).mockReturnValue({
         title: 'Test task',
         dueToDate: '2025-02-10'
      });

      render(<IncomingDeadline />);

      expect(screen.getByText('Приближающийся дедлайн')).toBeInTheDocument();
      expect(screen.getByText('Test task')).toBeInTheDocument();

      const formatted = dayjs('2025-02-10').format('YYYY-MM-DD');
      expect(screen.getByText(`Срок: ${formatted}`)).toBeInTheDocument();
   });

   test('button hides and displays card', () => {
      (AuthExports.useAuthContext as any).mockReturnValue({ isAuthed: true });

      (getIncomingDeadline as any).mockReturnValue({
         title: 'Task',
         dueToDate: '2025-01-01'
      });

      render(<IncomingDeadline />);

      const button = screen.getByRole('button');

      expect(screen.getByText('Task')).toBeInTheDocument();

      fireEvent.click(button);
      expect(screen.queryByText('Task')).not.toBeInTheDocument();

      fireEvent.click(button);
      expect(screen.getByText('Task')).toBeInTheDocument();
   });
});
