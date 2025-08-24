import { useState, type FC } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { type IRegisterFormData } from '../../authTypes';
import { Button, Flex, Form, Input } from 'antd';
import AuthExports from '../../../../shared/context/AuthContext';
import styles from './RegisterForm.module.scss';

const { useAuthContext } = AuthExports;

const RegisterForm: FC = () => {
   const [registerStatus, setRegisterStatus] = useState<string>('');
   const [isLoading, setIsLoading] = useState<boolean>(false);

   const { handleSubmit, control, formState: { errors }, trigger } = useForm<IRegisterFormData>()
   const { register } = useAuthContext();

   const onFinish = async (): Promise<void> => {
      const isValidData = await trigger(['email', 'password', 'username']);
   
      if (isValidData) handleSubmit(onSubmit)();
   };
   
   const onSubmit = async (data: IRegisterFormData): Promise<void> => {
      setRegisterStatus('');
      setIsLoading(true);
      const response = await register(data.email, data.password, data.username);

      if (response instanceof Error) {
         setRegisterStatus(response.message);
         setIsLoading(false);
         return;
      }
      if (response?.message) {
         setRegisterStatus(response.message);
      }

      setIsLoading(false);
   };

   return (
      <>
         <h3>Регистрация</h3>
         <Form onFinish={onFinish}>
            <Form.Item label='Почта' required validateStatus={errors.email ? 'error' : ''} help={errors.email?.message} className={styles.formItem}>
               <Controller name='email' control={control} rules={{ required: 'Введите почту', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Неверный формат почты' } }} render={({ field }) => <Input {...field} />} />
            </Form.Item>
            <Form.Item label='Пароль' required validateStatus={errors.password ? 'error' : ''} help={errors.password?.message} className={styles.formItem}>
               <Controller name='password' control={control} rules={{ required: 'Введите пароль', minLength: { value: 6, message: 'Пароль должен содержать минимум 6 символов' } }} render={({ field }) => <Input.Password {...field} />} />
            </Form.Item>
            <Form.Item label='Никнейм' required validateStatus={errors.username ? 'error' : ''} help={errors.username?.message} className={styles.formItem}>
               <Controller name='username' control={control} rules={{ required: 'Введите никнейм', minLength: { value: 4, message: 'Никнейм должен содержать минимум 4 символа' } }} render={({ field }) => <Input {...field} />} />
            </Form.Item>
            <Flex justify='center'>
               <Button color="default" variant="solid" htmlType='submit' disabled={isLoading}>Зарегистрироваться</Button>
            </Flex>
         </Form>
         <Flex vertical align='center' gap='middle'>
            {registerStatus && 
               <span className={
                  registerStatus.toLowerCase().includes('неверный') ||
                  registerStatus.toLowerCase().includes('failed') ||
                  registerStatus.toLowerCase().includes('ошибка') ? 
                  'bad-request' : 'success-request'
               }>
                  {registerStatus}
               </span>
            }
         </Flex>
      </>
   )
}

export default RegisterForm
