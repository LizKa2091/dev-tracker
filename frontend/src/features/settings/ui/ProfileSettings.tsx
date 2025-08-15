import { Button, Flex, Form, Input, Spin } from 'antd';
import { useEffect, useState, type FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useUserData } from '../../user/model/useUserData';
import { useUpdateUserData } from '../model/useUpdateUserData';
import styles from './ProfileSettings.module.scss';

interface IFormData {
   username: string;
   email: string;
};

const ProfileSettings: FC = () => {
   const [token, setToken] = useState<string | null>(null);

   const { handleSubmit, control, trigger, formState: { errors }, reset } = useForm<IFormData>();
   const { data: userData } = useUserData(token);
   const { mutate: updateUser, isPending, isSuccess, isError } = useUpdateUserData(token);

   useEffect(() => {
      setToken(localStorage.getItem('token'));
   }, []);

   useEffect(() => {
      if (userData) {
         reset({ username: userData.name, email: userData.email });
      }
   }, [userData, reset]);

   const onFinish = async () => {
      const isValidData = await trigger(['username', 'email']);

      if (isValidData) handleSubmit(onSubmit)();
   };

   const onSubmit = async (data: IFormData) => {
      updateUser({ name: data.username, email: data.email });
   };

   return (
      <Flex vertical gap='large' className={styles.container}>
         <h3>Профиль</h3>
         <Form onFinish={onFinish} className={styles.form}>
            <Form.Item label='Имя пользователя' validateStatus={errors.username ? 'error' : ''} help={errors.username?.message} className={styles.formItem}>
               <Controller name='username' control={control} rules={{ required: true, minLength: { value: 4, message: 'Никнейм должен содержать минимум 4 символа' } }} render={({ field }) => <Input {...field} />} />
            </Form.Item>
            <Form.Item label='Почта' validateStatus={errors.email ? 'error' : ''} help={errors.email?.message} className={styles.formItem}>
               <Controller name='email' control={control} rules={{ required: true, pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Неверный формат почты' } }} render={({ field }) => <Input {...field} />} />
            </Form.Item>
            <Button color="default" variant="solid" htmlType='submit' className={styles.buttonSave}>Сохранить</Button>
         </Form>
         {isPending ? <Spin /> :
            isSuccess ? <span className={styles.formSuccess}>Данные успешно обновлены</span> : 
            isError ? <span className={styles.formError}>Произошла ошибка</span> : ''}
      </Flex>
   )
}

export default ProfileSettings;