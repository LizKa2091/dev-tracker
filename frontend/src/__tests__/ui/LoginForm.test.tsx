import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '../../features/auth/ui/LoginForm/LoginForm';
import AuthExports from '../../shared/context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { initTags } from '../../features/notes/model/initTags'; 

vi.mock('../../shared/context/AuthContext');
vi.mock('../../features/notes/model/initTags');

describe('LoginForm tests', () => {
   const login = vi.fn();
   const Wrapper = ({ children }: any) => <BrowserRouter>{children}</BrowserRouter>;

   beforeEach(() => {
      vi.resetAllMocks();

      (AuthExports.useAuthContext as any).mockReturnValue({
         login
      });

      login.mockResolvedValue({ token: 'abc', message: 'Успешно' });
   });

   test('displays validation errors', async () => {
      render(<LoginForm />, { wrapper: Wrapper });

      fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

      expect(await screen.findByText('Введите почту')).toBeInTheDocument();
      expect(await screen.findByText('Введите пароль')).toBeInTheDocument();
   });

   test('successful login displays message', async () => {
      render(<LoginForm />, { wrapper: Wrapper });

      const emailInput = screen.getByTestId('email');
      const passInput = screen.getByTestId('password');

      fireEvent.change(emailInput, {
         target: { value: 'test@mail.com' }
      });

      fireEvent.change(passInput, {
         target: { value: '123456' }
      });

      fireEvent.click(screen.getByRole('button'));

      expect(await screen.findByText(/успешно/i)).toBeInTheDocument();
      expect(initTags).toHaveBeenCalled();
   });

   test('login error displays error', async () => {
      login.mockResolvedValue(new Error('Неверный пароль'));

      render(<LoginForm />, { wrapper: Wrapper });

      const emailInput = screen.getByTestId('email');
      const passInput = screen.getByTestId('password');

      fireEvent.change(emailInput, {
         target: { value: 'test@mail.com' }
      });

      fireEvent.change(passInput, {
         target: { value: '123456' }
      });

      fireEvent.click(screen.getByRole('button'));

      expect(await screen.findByText('Неверный пароль')).toBeInTheDocument();
   });
});
