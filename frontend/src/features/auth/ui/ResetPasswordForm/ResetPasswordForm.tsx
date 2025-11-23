import { Button, Flex, Form, Input } from 'antd';
import { useState, type FC } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useResetPassword } from '../../model/useAuth';
import type { AxiosError } from 'axios';
import styles from './ResetPasswordForm.module.scss';
import { Link } from 'react-router-dom';

interface IResetFormData {
   newPassword: string;
   passwordRepeat: string;
};

const ResetPasswordForm: FC = () => {
   const [resultMessage, setResultMessage] = useState<string>('');
   const { handleSubmit, control, formState: { errors }, trigger, watch } = useForm<IResetFormData>();
   const { mutateAsync: resetPassword, isSuccess, isPending } = useResetPassword();

   const onFinish = async (): Promise<void> => {
      const isValidData = await trigger(['newPassword', 'passwordRepeat']);

      if (isValidData) handleSubmit(onSubmit)();
   };

   const onSubmit = async (data: IResetFormData): Promise<void> => {
      setResultMessage('');

      const resetToken = localStorage.getItem('resetToken');
      if (!resetToken) {
         setResultMessage('Ошибка, не предоставлен токен для сброса пароля');
         return;
      }

      try {
         const response = await resetPassword({ token: resetToken, newPassword: data.newPassword });
         
         localStorage.removeItem('resetToken');
         setResultMessage(response.message);
      }
      catch(err) {
         const error = err as AxiosError;
         setResultMessage(error.message);
      }
   };

   return (
      <Flex vertical gap='middle' className={styles.mainContainer}>
         <h3>Смена пароля</h3>
         <Form onFinish={onFinish} className={styles.form}>
            <Form.Item 
               label='Новый пароль'  
               validateStatus={errors.newPassword ? 'error' : ''} 
               help={errors.newPassword?.message} 
               required
               className={styles.formItem}
            >
               <Controller 
                  name='newPassword' 
                  control={control} 
                  rules={{ 
                     required: 'Введите новый пароль', 
                     minLength: { value: 6, message: 'Минимум 6 символов' } 
                  }} 
                  render={({ field }) => 
                     <Input.Password placeholder='Новый пароль' {...field} />
                  } 
               />
            </Form.Item>
            <Form.Item 
               label='Новый пароль повторно' 
               validateStatus={errors.passwordRepeat ? 'error' : ''} 
               help={errors.passwordRepeat?.message} 
               required 
               className={styles.formItem}
            >
               <Controller 
                  name='passwordRepeat' 
                  control={control} 
                  rules={{ 
                     required: 'Введите новый пароль ещё раз', 
                     validate: (value) => value === watch('newPassword') || 'Пароли должны совпадать' 
                  }} 
                  render={({ field }) => 
                     <Input.Password placeholder='Введите новый пароль повторно' {...field} />
                  } 
               />
            </Form.Item>
            <Flex justify='center'>
               <Button 
                  color="default" 
                  variant="solid" 
                  htmlType='submit' 
                  disabled={isPending}
               >
                  Сменить пароль
               </Button>
            </Flex>
         </Form>
         <Flex vertical align='center' gap='middle'>
            {resultMessage &&
               <span className={!isSuccess ? 'bad-request' : 'success-request'}>
                  {resultMessage}
               </span>
            }
            {isSuccess &&
               <Link to='/auth'>Войти в профиль</Link>
            }
         </Flex>
      </Flex>
   )
}

export default ResetPasswordForm;