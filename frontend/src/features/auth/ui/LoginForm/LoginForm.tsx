import { useLayoutEffect, useState, type FC } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { type ILoginFormData } from '../../authTypes';
import { Button, Form, Input } from 'antd';
import AuthExports from '../../../../shared/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { initTags } from '../../../notes/model/initTags';
import styles from './LoginForm.module.scss';

const { useAuthContext } = AuthExports;

const LoginForm: FC = () => {
   const [loginStatus, setLoginStatus] = useState<string>('');
   const [isSuccessLogin, setIsSuccessLogin] = useState<boolean>(false);

   const { handleSubmit, control, formState: { errors }, trigger } = useForm<ILoginFormData>();
   const { login } = useAuthContext();

   const navigate = useNavigate();

   useLayoutEffect(() => {
      if (isSuccessLogin) {
         setLoginStatus('Вход выполнен успешно, через 3 секунды вы будете переадресованы на главную страницу');
         initTags();

         setTimeout(() => {
            navigate('/');
         }, 3000);
      }
   }, [isSuccessLogin, navigate]);

   const onFinish = async (): Promise<void> => {
      const isValidData = await trigger(['email', 'password']);

      if (isValidData) handleSubmit(onSubmit)();
   };

   const onSubmit = async (data: ILoginFormData): Promise<void> => {
      setLoginStatus('');

      const response = await login(data.email, data.password);
      
      if (response?.message) {
         setLoginStatus(response.message);
         setIsSuccessLogin(false);
      }
      else if (response.token) {
         localStorage.setItem('token', response.token);
         setIsSuccessLogin(true);
      }
   };

   return (
      <>
         <Form onFinish={onFinish}>
            <Form.Item label='Почта' required validateStatus={errors.email ? 'error' : ''} help={errors.email?.message} className={styles.formItem}>
               <Controller name='email' control={control} rules={{ required: true, pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Неверный формат почты' } }} render={({ field }) => <Input {...field} />} />
            </Form.Item>
            <Form.Item label='Пароль' required validateStatus={errors.password ? 'error' : ''} help={errors.password?.message} className={styles.formItem}>
               <Controller name='password' control={control} rules={{ required: true, minLength: { value: 6, message: 'Пароль должен содержать минимум 6 символов' } }} render={({ field }) => <Input.Password {...field} />} />
            </Form.Item>
            <Button color="default" variant="solid" htmlType='submit'>Войти</Button>
         </Form>
         {loginStatus && 
            <span className={
               loginStatus.toLowerCase().includes('неверный') ||
               loginStatus.toLowerCase().includes('failed') ||
               loginStatus.toLowerCase().includes('ошибка') ? 
               styles.badRequest : styles.successRequest
            }>
               {loginStatus}
            </span>
         }
      </>
   )
}

export default LoginForm;