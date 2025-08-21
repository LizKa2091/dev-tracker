import { Avatar, Button, Flex, Form, Input, Spin, Upload } from 'antd';
import { useEffect, useState, type FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useUserData } from '../../../user/model/useUserData';
import { useUpdateUserData } from '../../model/useUpdateUserData';
import { useUpdateAvatar } from '../../model/useUpdateAvatar';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import styles from './ProfileSettings.module.scss';
import DifficultySwitcher from '../Difficulty/DifficultySwitcher';

interface IUserDataFormData {
   username: string;
   email: string;
};

interface IAvatarFormData {
   file: File;
}

const ProfileSettings: FC = () => {
   const [previewImgUrl, setPreviewImgUrl] = useState<string | null>(null);
   const token: string | null = localStorage.getItem('token');

   const { handleSubmit: handleUserData, control: controlUserData, trigger, formState: { errors: userDataErrors }, reset } = useForm<IUserDataFormData>();
   const { handleSubmit: handleUserAvatar, control: controlAvatar, formState: { errors: avatarErrors } } = useForm<IAvatarFormData>();
   const { data: userData } = useUserData(token);
   const { mutate: updateUser, isPending: isUserPending, isSuccess: isUserSuccess, isError: isUserError } = useUpdateUserData(token);
   const { mutate: updateAvatar, isPending: isAvatarPending, isSuccess: isAvatarSuccess, isError: isAvatarError } = useUpdateAvatar(token);

   const queryClient = useQueryClient();

   useEffect(() => {
      if (userData) {
         reset({ username: userData.name, email: userData.email });

         if (userData.profilePic) setPreviewImgUrl(userData.profilePic);
      }
   }, [userData, reset]);

   const onFinishUserDataForm = async () => {
      const isValidData = await trigger(['username', 'email']);

      if (isValidData) handleUserData(onSubmitUserDataForm)();
   };

   const onSubmitUserDataForm = async (data: IUserDataFormData) => {
      updateUser({ name: data.username, email: data.email });
   };

   const onFinishAvatarForm = () => {
      handleUserAvatar(onSubmitAvatarForm)();
   };

   const onSubmitAvatarForm = (data: IAvatarFormData) => {
      if (!data.file) return;

      updateAvatar({ file: data.file }, { onSuccess: (res) => {
         setPreviewImgUrl((prev) => {
            if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);

            return res.profilePic;
         })

         queryClient.invalidateQueries({ queryKey: ['userData', token]});
      }});
   };

   return (
      <Flex vertical gap='large' className={styles.container}>
         <h3>Профиль</h3>

         <h4>Смена данных</h4>
         <Form onFinish={onFinishUserDataForm} className={styles.form}>
            <Form.Item label='Имя пользователя' validateStatus={userDataErrors.username ? 'error' : ''} help={userDataErrors.username?.message} className={styles.formItem}>
               <Controller name='username' control={controlUserData} rules={{ required: true, minLength: { value: 4, message: 'Никнейм должен содержать минимум 4 символа' } }} render={({ field }) => <Input {...field} />} />
            </Form.Item>
            <Form.Item label='Почта' validateStatus={userDataErrors.email ? 'error' : ''} help={userDataErrors.email?.message} className={styles.formItem}>
               <Controller name='email' control={controlUserData} rules={{ required: true, pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Неверный формат почты' } }} render={({ field }) => <Input {...field} />} />
            </Form.Item>
            <Button color="default" variant="solid" htmlType='submit' className={styles.buttonSave}>Сохранить</Button>
         </Form>
         {isUserPending ? <Spin /> :
            isUserSuccess ? <span className={styles.formSuccess}>Данные успешно обновлены</span> : 
            isUserError ? <span className={styles.formError}>Произошла ошибка</span> : ''
         }
         
         <DifficultySwitcher />

         <h4>Смена аватара</h4>
         <Form onFinish={onFinishAvatarForm} className={styles.form}>
            <Flex>
               <Avatar size={96} src={previewImgUrl ?? undefined} icon={!previewImgUrl ? <UserOutlined /> : undefined} />
            </Flex>
            <Form.Item label='Загрузите файл (только .JPG, .JPEG, .PNG' validateStatus={avatarErrors.file ? 'error' : ''} help={avatarErrors.file?.message} className={styles.formItem}>
               <Controller name='file' control={controlAvatar} rules={{ required: 'Загрузите файл' }} render={({ field }) => (
                  <Upload accept='image/jpeg,image/png' beforeUpload={(file) => {
                        if (!['image/jpeg', 'image/png'].includes(file.type)) return Upload.LIST_IGNORE;

                        field.onChange(file);
                        const url = URL.createObjectURL(file);

                        setPreviewImgUrl((prev) => {
                           if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);

                           return url;
                        });
                        return false;
                     }}
                     maxCount={1}
                     showUploadList={{ showRemoveIcon: true }}
                     onRemove={() => {
                        field.onChange(undefined);
                        setPreviewImgUrl(userData?.profilePic || null);
                     }}
                  >
                     <Button color="default" variant="solid" icon={<UploadOutlined />}>Выбрать файл</Button>
                  </Upload>
                  )}
               />
            </Form.Item>
            <Button color="default" variant="solid" htmlType="submit" disabled={isAvatarPending}>Сохранить</Button>
         </Form>
         {isAvatarPending ? <Spin /> :
            isAvatarSuccess ? <span className={styles.formSuccess}>Аватар успешно обновлён</span> :
            isAvatarError ? <span className={styles.formError}>Ошибка загрузки аватара</span> : ''
         }
      </Flex>
   )
}

export default ProfileSettings;