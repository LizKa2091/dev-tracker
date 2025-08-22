import { useEffect, type FC } from 'react';
import { Form, Button, Spin, Input } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { useUpdateUserData } from '../../../model/useUpdateUserData';
import { useUserData } from '../../../../user/model/useUserData';
import AuthExports from '../../../../../shared/context/AuthContext';
import styles from './UserDataForm.module.scss';

interface IUserDataFormData {
   username: string;
   email: string;
};

const UserDataForm: FC = () => {
   const { token } = AuthExports.useAuthContext();
   const { data: userData } = useUserData(token);
   const { mutate, isPending, isSuccess, isError } = useUpdateUserData(token);
   const { handleSubmit, control, trigger, formState: { errors }, reset } = useForm<IUserDataFormData>();

   useEffect(() => {
      if (userData) {
         reset({ username: userData.name, email: userData.email });
      }
   }, [userData, reset]);

   const onFinishUserDataForm = async () => {
      const isValidData = await trigger(['username', 'email']);

      if (isValidData) handleSubmit(onSubmitUserDataForm)();
   };

   const onSubmitUserDataForm = async (data: IUserDataFormData) => {
      mutate({ name: data.username, email: data.email });
   };

   return (
      <>
         <h4>Смена данных</h4>
         <Form onFinish={onFinishUserDataForm} className={styles.form}>
            <Form.Item label='Имя пользователя' validateStatus={errors.username ? 'error' : ''} help={errors.username?.message} className={styles.formItem}>
               <Controller name='username' control={control} rules={{ required: true, minLength: { value: 4, message: 'Никнейм должен содержать минимум 4 символа' } }} render={({ field }) => <Input {...field} />} />
            </Form.Item>
            <Form.Item label='Почта' validateStatus={errors.email ? 'error' : ''} help={errors.email?.message} className={styles.formItem}>
               <Controller name='email' control={control} rules={{ required: true, pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Неверный формат почты' } }} render={({ field }) => <Input {...field} />} />
            </Form.Item>
            <Button color="default" variant="solid" htmlType='submit' disabled={isPending} className={styles.buttonSave}>Сохранить</Button>
         </Form>
         {isPending ? <Spin /> :
            isSuccess ? <span className={styles.formSuccess}>Данные успешно обновлены</span> : 
            isError ? <span className={styles.formError}>Произошла ошибка</span> : ''
         }
      </>
   )
}

export default UserDataForm;