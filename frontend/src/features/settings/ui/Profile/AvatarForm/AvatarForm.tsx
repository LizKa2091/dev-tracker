import { useState, type FC } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Form, Flex, Avatar, Upload, Button, Spin } from 'antd';
import { useUpdateAvatar } from '../../../model/useUpdateAvatar';
import AuthExports from '../../../../../shared/context/AuthContext';
import { useUserData } from '../../../../user/model/useUserData';
import { useQueryClient } from '@tanstack/react-query';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import styles from './AvatarForm.module.scss';

interface IAvatarFormData {
   file: File;
};

const AvatarForm: FC = () => {
   const { token } = AuthExports.useAuthContext();
   const [previewImgUrl, setPreviewImgUrl] = useState<string | null>(null);

   const { data: userData } = useUserData(token);
   const { handleSubmit, control, formState: { errors } } = useForm<IAvatarFormData>();
   const { mutate: updateAvatar, isPending, isSuccess, isError } = useUpdateAvatar(token);

   const queryClient = useQueryClient();

   const onFinishAvatarForm = () => {
      handleSubmit(onSubmitAvatarForm)();
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
      <>
         <h4>Смена аватара</h4>
         <Form onFinish={onFinishAvatarForm} className={styles.form}>
            <Flex vertical gap='middle'>
               <Flex justify='center' align='center'>
                  <Avatar size={96} src={previewImgUrl ?? undefined} icon={!previewImgUrl ? <UserOutlined /> : undefined} />
               </Flex>
               <Form.Item label='Загрузите файл (только .JPG, .JPEG, .PNG' validateStatus={errors.file ? 'error' : ''} help={errors.file?.message} className={styles.formItem}>
                  <Controller name='file' control={control} rules={{ required: 'Загрузите файл' }} render={({ field }) => (
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
               <Button color="default" variant="solid" htmlType="submit" disabled={isPending} className={styles.buttonSave}>Сохранить</Button>
            </Flex>
         </Form>
         {isPending ? <Spin /> :
            isSuccess ? <span className={styles.formSuccess}>Аватар успешно обновлён</span> :
            isError ? <span className={styles.formError}>Ошибка загрузки аватара</span> : ''
         }
      </>
   )
}

export default AvatarForm;