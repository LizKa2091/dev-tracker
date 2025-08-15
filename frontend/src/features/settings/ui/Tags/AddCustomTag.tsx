import { Button, ColorPicker, Flex, Form, Input, Modal, Tag } from 'antd';
import { useEffect, useState, type FC } from 'react'
import { Controller, useForm } from 'react-hook-form';
import styles from './AddCustomTag.module.scss';

const cancelButtonStyles = {
   backgroundColor: '#000',
   border: '#000', 
   color: '#fff'
}

interface IFormData {
   tagName: string;
   color: string;
}

interface IAddCustomTagProps {
   isModalOpen: boolean;
   setIsModalOpen: (value: boolean) => void;
}

const AddCustomTag: FC<IAddCustomTagProps> = ({ isModalOpen, setIsModalOpen }) => {
   const [token, setToken] = useState<string | null>(null);

   const { handleSubmit, control, trigger, formState: { errors }, watch } = useForm<IFormData>({defaultValues: { tagName: '', color: '#000' }});
   const tagName = watch('tagName');
   const tagColor = watch('color');

   useEffect(() => {
      setToken(localStorage.getItem('token'));
   }, []);

   const onFinish = async (): Promise<void> => {
      const isValidData = await trigger(['tagName', 'color']);

      if (isValidData) handleSubmit(onSubmit)();
   };

   const onSubmit = async (data: IFormData) => {
      if (token) {
         console.log(data);
      }
   };

   return (
      <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} cancelText='Закрыть' okButtonProps={{style: { display: 'none' }}} cancelButtonProps={{style: cancelButtonStyles}} className={styles.modal}>
         <Flex vertical gap='large' className={styles.container}>
            <h3>Тэги</h3>
            <Form onFinish={onFinish} className={styles.form}>
               <Form.Item label='Название нового тэга' validateStatus={errors.tagName ? 'error' : ''} help={errors.tagName?.message} className={styles.formItem}>
                  <Controller name='tagName' control={control} rules={{ required: true, minLength: { value: 2, message: 'Название должно содержать минимум 2 символа' } }} render={({ field }) => <Input {...field} />} />
               </Form.Item>
               <Form.Item label='Основной цвет' validateStatus={errors.color ? 'error' : ''} help={errors.color?.message} className={styles.formItem}>
                  <Controller name='color' control={control} rules={{ required: true }} render={({ field }) => <ColorPicker onChange={(_, hex) => field.onChange(hex)} value={field.value} />} />
               </Form.Item>
               <Button color="default" variant="solid" htmlType='submit' className={styles.buttonSave}>Добавить</Button>
            </Form>
            {/* {isPending ? <Spin /> :
            isSuccess ? <span className={styles.formSuccess}>Данные успешно обновлены</span> : 
            isError ? <span className={styles.formError}>Произошла ошибка</span> : ''} */}
            <h4>Предпросмотр тэга</h4>
            <Tag color={tagColor} className={styles.tagPreview}>{tagName}</Tag>
         </Flex>
      </Modal>
   )
}

export default AddCustomTag;