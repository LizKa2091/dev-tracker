import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AuthSwitcher from '../../features/auth/ui/AuthSwitcher/AuthSwitcher';

vi.mock('../../features/auth/ui/LoginForm/LoginForm', () => ({
   default: () => <div>LOGIN_FORM</div>
}));

vi.mock('../../features/auth/ui/RegisterForm/RegisterForm', () => ({
   default: () => <div>REGISTER_FORM</div>
}));

vi.mock('../..//features/auth/ui/ForgotPassForm/ForgotPassForm', () => ({
   default: () => <div>FORGOT_FORM</div>
}));

vi.mock('../../features/auth/ui/AuthSwitcher/AuthSwitcher.module.scss', () => ({
   default: { mainContainer: 'main', buttonsContainer: 'buttons', button: 'button' }
}));

describe('AuthSwitcher tests', () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   test('display LoginForm by default', () => {
      render(<AuthSwitcher />);
      expect(screen.getByText('LOGIN_FORM')).toBeInTheDocument();
   });

   test('switch from login to register', () => {
      render(<AuthSwitcher />);

      fireEvent.click(
         screen.getByText('Нет аккаунта? Зарегистрироваться')
      );

      expect(screen.getByText('REGISTER_FORM')).toBeInTheDocument();
   });

   test('switch from login to forgot', () => {
      render(<AuthSwitcher />);

      fireEvent.click(
         screen.getByText('Восстановить пароль')
      );

      expect(screen.getByText('FORGOT_FORM')).toBeInTheDocument();
   });

   test('switch from register to login', () => {
      render(<AuthSwitcher />);

      fireEvent.click(
         screen.getByText('Нет аккаунта? Зарегистрироваться')
      );

      fireEvent.click(
         screen.getByText('Уже есть аккаунт? Войти')
      );

      expect(screen.getByText('LOGIN_FORM')).toBeInTheDocument();
   });

   test('switch forgot to login', () => {
      render(<AuthSwitcher />);

      fireEvent.click(screen.getByText('Восстановить пароль'));

      fireEvent.click(
         screen.getByText('Вернуться ко входу в аккаунт')
      );

      expect(screen.getByText('LOGIN_FORM')).toBeInTheDocument();
   });
});
