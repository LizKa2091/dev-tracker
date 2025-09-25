import { useState, type FC } from 'react';
import { Link } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { Button, Flex, Form, Input } from 'antd';
import styles from './ForgotPassForm.module.scss';
import { useForgotPassword } from '../../model/useAuth';
import type { AxiosError } from 'axios';

interface IForgotFormData {
   email: string;
}

const ForgotPassForm: FC = () => {
   const [resultMessage, setResultMessage] = useState<string>('');
   const {
      handleSubmit,
      control,
      formState: { errors },
      trigger
   } = useForm<IForgotFormData>();
   const {
      mutateAsync: forgotPassword,
      isPending,
      isSuccess
   } = useForgotPassword();

   const onFinish = async (): Promise<void> => {
      const isValidData = await trigger(['email']);

      if (isValidData) handleSubmit(onSubmit)();
   };

   const onSubmit = async (data: IForgotFormData): Promise<void> => {
      setResultMessage('');

      try {
         const response = await forgotPassword({ email: data.email });

         if (response.resetToken) {
            localStorage.setItem('resetToken', response.resetToken);
         } else {
            localStorage.removeItem('resetToken');
         }

         setResultMessage(response.message);
      } catch (err) {
         const error = err as AxiosError;
         setResultMessage(
            error.message || 'Произошла ошибка во время поиска аккаунта'
         );
      }
   };

   return (
      <>
         <h3>Восстановление пароля</h3>
         <Form onFinish={onFinish} className={styles.form}>
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
                  render={({ field }) => <Input {...field} />}
               />
            </Form.Item>
            <Flex justify="center">
               <Button
                  color="default"
                  variant="solid"
                  htmlType="submit"
                  disabled={isPending}
               >
                  Найти аккаунт
               </Button>
            </Flex>
         </Form>
         <Flex vertical align="center" gap="middle">
            {resultMessage && (
               <span className={!isSuccess ? 'bad-request' : 'success-request'}>
                  {resultMessage}
               </span>
            )}
            {isSuccess && <Link to="/reset-password">Сменить пароль</Link>}
         </Flex>
      </>
   );
};

export default ForgotPassForm;
