import { useLayoutEffect, useState, type FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { Button, Flex, Form, Input } from 'antd';
import { type ILoginFormData } from '../../authTypes';
import AuthExports from '../../../../shared/context/AuthContext';
import { initTags } from '../../../notes/model/initTags';
import styles from './LoginForm.module.scss';

const { useAuthContext } = AuthExports;

const LoginForm: FC = () => {
   const [loginStatus, setLoginStatus] = useState<string>('');
   const [isSuccessLogin, setIsSuccessLogin] = useState<boolean>(false);
   const [isLoading, setIsLoading] = useState<boolean>(false);

   const {
      handleSubmit,
      control,
      formState: { errors },
      trigger
   } = useForm<ILoginFormData>();
   const { login } = useAuthContext();

   const navigate = useNavigate();
   const location = useLocation();

   useLayoutEffect(() => {
      let timeoutId: ReturnType<typeof setTimeout>;
      if (isSuccessLogin) {
         setLoginStatus(
            'Вход выполнен успешно, через 3 секунды вы будете переадресованы на главную страницу'
         );
         initTags();

         timeoutId = setTimeout(() => {
            if (location.pathname === '/auth') {
               navigate('/');
            }
         }, 3000);
      }

      return () => {
         if (timeoutId) clearTimeout(timeoutId);
      };
   }, [isSuccessLogin, navigate, location]);

   const onFinish = async (): Promise<void> => {
      const isValidData = await trigger(['email', 'password']);

      if (isValidData) handleSubmit(onSubmit)();
   };

   const onSubmit = async (data: ILoginFormData): Promise<void> => {
      setLoginStatus('');
      setIsLoading(true);

      const response = await login(data.email, data.password);

      if (response instanceof Error) {
         setLoginStatus(response.message);
         setIsSuccessLogin(false);
         setIsLoading(false);
         return;
      }
      if (response.message) setLoginStatus(response.message);
      if (response.token) setIsSuccessLogin(true);

      setIsLoading(false);
   };

   return (
      <>
         <h3>Вход в аккаунт</h3>
         <Form onFinish={onFinish}>
            <Form.Item
               label="Почта"
               required
               validateStatus={errors.email ? 'error' : ''}
               help={errors.email?.message}
               className={styles.formItem}
            >
               <Controller
                  name="email"
                  control={control}
                  rules={{
                     required: 'Введите почту',
                     pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Неверный формат почты'
                     }
                  }}
                  render={({ field }) => <Input data-testid='email' {...field} />}
               />
            </Form.Item>
            <Form.Item
               label="Пароль"
               required
               validateStatus={errors.password ? 'error' : ''}
               help={errors.password?.message}
               className={styles.formItem}
            >
               <Controller
                  name="password"
                  control={control}
                  rules={{
                     required: 'Введите пароль',
                     minLength: {
                        value: 6,
                        message: 'Пароль должен содержать минимум 6 символов'
                     }
                  }}
                  render={({ field }) => <Input.Password data-testid='password' {...field} />}
               />
            </Form.Item>
            <Flex justify="center">
               <Button
                  color="default"
                  variant="solid"
                  htmlType="submit"
                  disabled={isLoading}
               >
                  Войти
               </Button>
            </Flex>
         </Form>
         <Flex vertical align="center" gap="middle">
            {loginStatus && (
               <span
                  className={
                     loginStatus.toLowerCase().includes('неверный') ||
                     loginStatus.toLowerCase().includes('failed') ||
                     loginStatus.toLowerCase().includes('ошибка')
                        ? 'bad-request'
                        : 'success-request'
                  }
               >
                  {loginStatus}
               </span>
            )}
         </Flex>
      </>
   );
};

export default LoginForm;
