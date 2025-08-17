import { Button, Flex, Form, Input } from 'antd';
import { useState, type FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useChangePassword } from '../../model/useChangePassword';
import styles from './SecuritySettings.module.scss';

interface IFormData {
   currPass: string;
   newPass: string;
};

const SecuritySettings: FC = () => {
   const [requestStatus, setRequestStatus] = useState<string>('');
   const token: string | null = localStorage.getItem('token');

   const { control, handleSubmit, formState: { errors }, trigger } = useForm<IFormData>();
   const { mutateAsync } = useChangePassword(token);

   const onFinish = async () => {
      const isValidData = await trigger(['currPass', 'newPass']);

      if (isValidData) handleSubmit(onSubmit)();
   };

   const onSubmit = async (data: IFormData) => {
      setRequestStatus('');

      try {
         const response = await mutateAsync({ ...data });
         setRequestStatus(response.message);
      }
      catch (e) {
         const error = e as Error;
         setRequestStatus(error.message || 'Произошла ошибка при смене пароля');
      }
   };

   return (
      <Flex vertical gap='large' className={styles.container}>
         <h3>Безопасность</h3>
         <Flex vertical gap='middle' className={styles.innerContainer}>
            <h4>Смена пароля</h4>
            <Form onFinish={onFinish} className={styles.form}>
               <Form.Item label='Старый пароль' required validateStatus={errors.currPass ? 'error' : ''} help={errors.currPass?.message} className={styles.formItem}>
                  <Controller name='currPass' control={control} rules={{ required: 'Обязательное поле', minLength: { value: 6, message: 'Пароль должен содержать минимум 6 символов' } }} render={({ field }) => <Input {...field} />} />
               </Form.Item>
               <Form.Item label='Новый пароль' required validateStatus={errors.newPass ? 'error' : ''} help={errors.newPass?.message} className={styles.formItem}>
                  <Controller name='newPass' control={control} rules={{ required: 'Обязательное поле', minLength: { value: 6, message: 'Пароль должен содержать минимум 6 символов' } }} render={({ field }) => <Input {...field} />} />
               </Form.Item>
               <Button color="default" variant="solid" htmlType='submit'>Сменить пароль</Button>
            </Form>
            <span className={
                  requestStatus.toLowerCase().includes('не найден') ||
                  requestStatus.toLowerCase().includes('неверный') ?
                  styles.responseFailed : styles.responseSuccess
               }
            >{requestStatus}</span>
         </Flex>
         <Flex>
            <h4>Выход из аккаунта</h4>
         </Flex>
      </Flex>
   )
}

export default SecuritySettings;