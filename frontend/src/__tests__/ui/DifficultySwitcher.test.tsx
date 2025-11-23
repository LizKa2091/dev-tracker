import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import DifficultySwitcher from '../../features/settings/ui/Difficulty/DifficultySwitcher';
import AuthExports from '../../shared/context/AuthContext';
import { useUserData } from '../../features/user/model/useUserData';
import { useUpdateDifficulty } from '../../features/settings/model/useUpdateDifficulty';

vi.mock('../../features/user/model/useUserData', () => ({
   useUserData: vi.fn()
}));

vi.mock('../../features/settings/model/useUpdateDifficulty', () => ({
   useUpdateDifficulty: vi.fn()
}));

vi.mock('@tanstack/react-query', () => ({
   useQueryClient: () => ({
      invalidateQueries: vi.fn()
   })
}));

vi.mock('../../shared/context/AuthContext', () => ({
   default: {
      useAuthContext: vi.fn()
   }
}));

describe('DifficultySwitcher tests', () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   test('renders switcher', () => {
      AuthExports.useAuthContext.mockReturnValue({ token: 'TOKEN' });
      useUserData.mockReturnValue({ data: { difficulty: 'default' } });
      useUpdateDifficulty.mockReturnValue({ mutate: vi.fn(), isPending: false });

      render(<DifficultySwitcher />);

      expect(screen.getByText('Обычный')).toBeInTheDocument();
      expect(screen.getByText('Сложный')).toBeInTheDocument();
   });

   test('click on switcher calls updateDifficulty', () => {
      const mockMutate = vi.fn();

      AuthExports.useAuthContext.mockReturnValue({ token: 'TOKEN' });
      useUserData.mockReturnValue({ data: { difficulty: 'default' } });
      useUpdateDifficulty.mockReturnValue({ mutate: mockMutate, isPending: false });

      render(<DifficultySwitcher />);

      const switcher = screen.getByRole('switch');
      fireEvent.click(switcher);

      expect(mockMutate).toHaveBeenCalledWith(
         { difficulty: 'hard' },
         expect.any(Object)
      );
   });

   test('does not call mutate if there is no token', () => {
      const mockMutate = vi.fn();

      AuthExports.useAuthContext.mockReturnValue({ token: null });
      useUserData.mockReturnValue({ data: null });
      useUpdateDifficulty.mockReturnValue({ mutate: mockMutate, isPending: false });

      render(<DifficultySwitcher />);

      fireEvent.click(screen.getByRole('switch'));

      expect(mockMutate).not.toHaveBeenCalled();
   });
});
