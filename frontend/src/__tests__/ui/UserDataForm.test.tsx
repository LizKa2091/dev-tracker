import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import AuthExports from '../../shared/context/AuthContext';
import { useUserData } from '../../features/user/model/useUserData';
import { useUpdateUserData } from '../../features/settings/model/useUpdateUserData';
import UserDataForm from '../../features/settings/ui/Profile/UserDataForm/UserDataForm';

vi.mock('../../shared/context/AuthContext', () => ({
   default: {
      useAuthContext: vi.fn(),
   },
}));

vi.mock('../../features/user/model/useUserData', () => ({
   useUserData: vi.fn(),
}));

vi.mock('../../features/settings/model/useUpdateUserData', () => ({
   useUpdateUserData: vi.fn(),
}));

describe('UserDataForm tests', () => {
   beforeEach(() => {
      vi.clearAllMocks();
      AuthExports.useAuthContext.mockReturnValue({ token: 'TOKEN' });
   });

   test('fills inputs with data from userData', async () => {
      useUserData.mockReturnValue({
         data: { name: 'John', email: 'john@example.com' },
      });

      useUpdateUserData.mockReturnValue({ mutate: vi.fn(), isPending: false });

      render(<UserDataForm />);

      expect(await screen.findByDisplayValue('John')).toBeInTheDocument();
      expect(await screen.findByDisplayValue('john@example.com')).toBeInTheDocument();
   });

   test('displays error if there are empty fields', async () => {
      useUserData.mockReturnValue({ data: {} });
      useUpdateUserData.mockReturnValue({ mutate: vi.fn(), isPending: false });

      render(<UserDataForm />);

      fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }));

      expect(await screen.findByText('Укажите имя пользователя')).toBeInTheDocument();
      expect(await screen.findByText('Укажите почту')).toBeInTheDocument();
   });

   test('displays success message', () => {
      useUserData.mockReturnValue({ data: {} });

      useUpdateUserData.mockReturnValue({
         mutate: vi.fn(),
         isPending: false,
         isSuccess: true,
      });

      render(<UserDataForm />);

      expect(screen.getByText('Данные успешно обновлены')).toBeInTheDocument();
   });

   test('displays error message', () => {
      useUserData.mockReturnValue({ data: {} });

      useUpdateUserData.mockReturnValue({
         mutate: vi.fn(),
         isPending: false,
         isError: true,
         error: new Error('Ошибка сервера'),
      });

      render(<UserDataForm />);

      expect(screen.getByText('Ошибка сервера')).toBeInTheDocument();
   });
});
