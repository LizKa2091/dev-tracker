import { useEffect, useState, type FC } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Form, Input, Button, Select, DatePicker, Tag } from 'antd';
import type { NewNoteFormData } from '../../noteTypes';
import { saveNote } from '../../model/noteStorage';
import { typeOptions } from '../../model/constants';
import MarkdownTextarea from '../../../../shared/markdown-textarea/ui/ui/MarkdownTextarea';
import { loadUserTags } from '../../../settings/model/tagActions';
import { type ITagItem } from '../../../settings/tagTypes';
import AuthExports from '../../../../shared/context/AuthContext';
import styles from './NewNoteForm.module.scss';

interface INewNoteFormProps {
   isNoteSaved: boolean;
   setIsNoteSaved: (value: boolean) => void;
}

const NewNoteForm: FC<INewNoteFormProps> = ({ isNoteSaved, setIsNoteSaved }) => {
   const { token } = AuthExports.useAuthContext();
   const [userTags, setUserTags] = useState<ITagItem[]>();
   const [formattedDescription, setFormattedDescription] = useState<string>('');
   const { handleSubmit, control, formState: { errors }, trigger } = useForm<NewNoteFormData>();

   useEffect(() => {
      if (token) {
         setUserTags(loadUserTags());
      }
   }, [token])

   useEffect(() => {
      if (isNoteSaved) {
         setTimeout(() => {
            setIsNoteSaved(false);
         }, 5000);
      }
   }, [isNoteSaved, setIsNoteSaved]);

   const onSubmit = (data: NewNoteFormData): void => {
      const key = data.date + new Date().getMilliseconds().toString();

      const savedNotes = saveNote({...data, tags: data.tags || [], key, formattedDescription: formattedDescription || '', status: 'active'});

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
               <Controller name='tags' control={control} render={({ field }) => {
                  const { value = [], onChange } = field;
                  const selectedValues = value.map(tag => tag.value);

                  return (
                     <Select mode='tags' value={selectedValues}
                        options={userTags?.map(tag => ({ label: tag.label, value: tag.value })) || []}
                        onChange={(selected: string[]) => {
                           const updatedTags: ITagItem[] = selected.map(val =>
                              userTags?.find(tag => tag.value === val) || { value: val, label: val, color: '#888', key: val }
                           );
                           onChange(updatedTags);
                        }}
                        tagRender={({ label, value, closable, onClose }) => {
                           const color = userTags?.find(tag => tag.value === value)?.color || '#888';
                           return (
                           <Tag color={color} closable={closable} onClose={onClose}>
                              {label}
                           </Tag>
                           );
                        }}
                        className={styles.formTags}
                     />);
                  }}
               />
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
            <span className='success-response'>Запись успешно сохранена</span>
         }
      </>
      
   )
}

export default NewNoteForm;