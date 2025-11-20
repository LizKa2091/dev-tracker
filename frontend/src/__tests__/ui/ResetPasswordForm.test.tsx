import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ResetPasswordForm from '../../features/auth/ui/ResetPasswordForm/ResetPasswordForm';
import { useResetPassword } from '../../features/auth/model/useAuth';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../features/auth/model/useAuth');

describe('ResetPasswordForm tests', () => {
   const mockReset = vi.fn();

   beforeEach(() => {
      (useResetPassword as any).mockReturnValue({
         mutateAsync: mockReset,
         isSuccess: false,
         isPending: false,
      });

      localStorage.clear();
      mockReset.mockReset();
   });

   const fillField = (placeholder: string, value: string) => {
      fireEvent.change(screen.getByPlaceholderText(placeholder), {
         target: { value },
      });
   };

   
   test('displays error message if there is no token', async () => {
      render(
         <MemoryRouter>
            <ResetPasswordForm />
         </MemoryRouter>
      );

      fillField('Новый пароль', '123456');
      fillField('Введите новый пароль повторно', '123456');

      fireEvent.click(
         screen.getByRole('button', { name: 'Сменить пароль' })
      );

      await waitFor(() => {
         expect(screen.getByText('Ошибка, не предоставлен токен для сброса пароля')).toBeInTheDocument();
      });
   });

   test('displays error message if there is server error', async () => {
      localStorage.setItem('resetToken', 'XYZ');

      mockReset.mockRejectedValue({ message: 'Ошибка сервера' });

      render(
         <MemoryRouter>
            <ResetPasswordForm />
         </MemoryRouter>
      );

      fillField('Новый пароль', 'testpass');
      fillField('Введите новый пароль повторно', 'testpass');

      fireEvent.click(
         screen.getByRole('button', { name: 'Сменить пароль' })
      );

      await waitFor(() => {
         expect(screen.getByText('Ошибка сервера')).toBeInTheDocument();
      });
   });
});
