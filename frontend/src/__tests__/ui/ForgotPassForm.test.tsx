import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForgotPassForm from '../../features/auth/ui/ForgotPassForm/ForgotPassForm';
import { useForgotPassword } from '../../features/auth/model/useAuth';

vi.mock('../../features/auth/model/useAuth');

describe('ForgotPassForm tests', () => {
   const mutateAsync = vi.fn();
   beforeEach(() => {
      vi.resetAllMocks();

      (useForgotPassword as any).mockReturnValue({
         mutateAsync,
         isPending: false,
         isSuccess: false
      });

      localStorage.clear();
   });

   test('displays error on wrong email', async () => {
      render(<ForgotPassForm />);

      const button = screen.getByRole('button', { name: 'Найти аккаунт' });
      fireEvent.click(button);

      const emailInput = screen.getByRole('textbox');
      fireEvent.change(emailInput, { target: { value: 'wrong_email' } });

      fireEvent.click(button);

      expect(await screen.findByText('Неверный формат почты')).toBeInTheDocument();
   });

   test('success response saves resetToken', async () => {
      mutateAsync.mockResolvedValue({
         resetToken: '123',
         message: 'Отправлено'
      });

      render(<ForgotPassForm />);

      fireEvent.change(screen.getByRole('textbox'), {
         target: { value: 'test@mail.com' }
      });

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() =>
         expect(localStorage.getItem('resetToken')).toBe('123')
      );

      expect(screen.getByText('Отправлено')).toBeInTheDocument();
   });

   test('request error displays message', async () => {
      mutateAsync.mockRejectedValue(new Error('Ошибка'));

      render(<ForgotPassForm />);

      fireEvent.change(screen.getByRole('textbox'), {
         target: { value: 'test@mail.com' }
      });

      fireEvent.click(screen.getByRole('button'));

      expect(await screen.findByText('Ошибка')).toBeInTheDocument();
   });
});
