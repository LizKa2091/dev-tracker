import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import UserProfile from '../../features/user/ui/UserProfile';
import AuthExports from '../../shared/context/AuthContext';
import { useUserData } from '../../features/user/model/useUserData';

vi.mock('../../shared/context/AuthContext');
vi.mock('../../features/user/model/useUserData');

describe('UserProfile tests', () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   test('displays loader if isLoading', () => {
      (AuthExports.useAuthContext as any).mockReturnValue({ token: '123' });
      (useUserData as any).mockReturnValue({ data: null, isLoading: true });

      render(<UserProfile />);
      expect(screen.getByText('Загрузка...')).toBeInTheDocument();
   });

   test('displays user data', () => {
      (AuthExports.useAuthContext as any).mockReturnValue({ token: '123' });
      (useUserData as any).mockReturnValue({
         data: { name: 'Ivan', profilePic: null, health: 25, xp: 50, level: 2, xpForNextLevel: 100 },
         isLoading: false
      });

      render(<UserProfile />);
      expect(screen.getByText('Ivan')).toBeInTheDocument();
      expect(screen.getByText(/Уровень 2/)).toBeInTheDocument();
      expect(screen.getByText('25/50')).toBeInTheDocument();
   });

   test('displays guest if there is no username', () => {
      (AuthExports.useAuthContext as any).mockReturnValue({ token: '123' });
      (useUserData as any).mockReturnValue({ data: { name: '', profilePic: null, health: 0, xp: 0, level: 0, xpForNextLevel: 0 }, isLoading: false });

      render(<UserProfile />);
      expect(screen.getByText('Гость')).toBeInTheDocument();
   });
});
