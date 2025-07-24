import { useEffect, useState, type FC } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Form, Input, Button, Select, DatePicker } from 'antd';
import type { NewNoteFormData } from '../noteTypes';
import { saveNote } from '../model/noteStorage';
import { tagOptions, typeOptions } from '../model/constants';
import styles from './NewNoteForm.module.scss';
import MarkdownTextarea from '../../../shared/ui/MarkdownTextarea/MarkdownTextarea';

interface INewNoteFormProps {
   isNoteSaved: boolean;
   setIsNoteSaved: (value: boolean) => void;
}

const NewNoteForm: FC<INewNoteFormProps> = ({ isNoteSaved, setIsNoteSaved }) => {
   const { handleSubmit, control, formState: { errors }, trigger } = useForm<NewNoteFormData>();

   const [formattedDescription, setFormattedDescription] = useState<string>('');

   useEffect(() => {
      if (isNoteSaved) {
         setTimeout(() => {
            setIsNoteSaved(false);
         }, 5000);
      }
   }, [isNoteSaved]);

   const onSubmit = (data: NewNoteFormData): void => {
      const key = data.date + new Date().getMilliseconds().toString();

      const savedNotes = saveNote({...data, key, formattedDescription: formattedDescription || ''});

      if (savedNotes) setIsNoteSaved(true);
      else setIsNoteSaved(false);
   };

   const onFinish = async (): Promise<void> => {
      const isValidData = await trigger(['title', 'type', 'date']);

      if (isValidData) handleSubmit(onSubmit)();
   };

   return (
      <>
         <Form onFinish={onFinish}>
            <Form.Item label='Название' required validateStatus={errors.title ? 'error' : ''} help={errors.title && 'Обязательное поле'} className={styles.formItem}>
               <Controller name='title' control={control} rules={{ required: true }} render={({ field }) => <Input {...field} />} />
            </Form.Item>
            <Form.Item label='Тип записи' required validateStatus={errors.type ? 'error' : ''} help={errors.type && 'Обязательное поле'} className={styles.formItem}>
               <Controller name='type' control={control} rules={{ required: true }} render={({ field }) => <Select showSearch options={typeOptions} {...field} />} />
            </Form.Item>
            <Form.Item label='Теги' className={styles.formItem}>
               <Controller name='tags' control={control} render={({ field }) => <Select mode='tags' options={tagOptions} className={styles.formTags} {...field} />} />
            </Form.Item>
            <Form.Item label='Выполнить до' required validateStatus={errors.date ? 'error' : ''} help={errors.date && 'Обязательное поле'} className={styles.formItem}>
               <Controller name='date' control={control} rules={{ required: true }} render={({ field }) => <DatePicker {...field} />} />
            </Form.Item>
            <Form.Item label='Описание' className={styles.formItem}>
               <Controller name='description' control={control} render={({ field }) => (
                     <MarkdownTextarea {...field} onFormattedChange={(formattedText: string) => setFormattedDescription(formattedText)} />
                  )}
               />
            </Form.Item>
            <Button color="default" variant="solid" htmlType='submit'>Создать</Button>
         </Form>
         {isNoteSaved && 
            <span>Запись успешно сохранена</span>
         }
      </>
      
   )
}

export default NewNoteForm;