import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import RegisterForm from '../../features/auth/ui/RegisterForm/RegisterForm';

const mockRegister = vi.fn();

vi.mock('../../shared/context/AuthContext', () => ({
   default: {
      useAuthContext: () => ({
         register: mockRegister
      })
   }
}));

const fillField = (label: string, value: string) => {
   const item = screen.getByText(label).closest('.ant-form-item')!;
   const input = item.querySelector('input')!;
   fireEvent.change(input, { target: { value } });
};

describe('RegisterForm tests', () => {
   beforeEach(() => {
      vi.resetAllMocks();
   });

   test('success register displays message', async () => {
      mockRegister.mockResolvedValue({ message: 'Успех!' });

      render(<RegisterForm />);

      fillField('Почта', 'test@mail.com');
      fillField('Пароль', '123456');
      fillField('Никнейм', 'testuser');

      fireEvent.click(screen.getByRole('button', { name: 'Зарегистрироваться' }));

      expect(await screen.findByText(/успех/i)).toBeInTheDocument();
   });

   test('fail register displays message', async () => {
      mockRegister.mockResolvedValue(new Error('Ошибка регистрации'));

      render(<RegisterForm />);

      fillField('Почта', 'test@mail.com');
      fillField('Пароль', '123456');
      fillField('Никнейм', 'testuser');

      fireEvent.click(screen.getByRole('button', { name: 'Зарегистрироваться' }));

      expect(await screen.findByText('Ошибка регистрации')).toBeInTheDocument();
   });
});
