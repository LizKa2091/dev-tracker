import { useEffect, useState, type FC } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Form, Input, Button, Select, DatePicker, Flex } from 'antd';
import type { NewNoteFormData } from '../../noteTypes';
import { saveNote } from '../../model/noteStorage';
import { typeOptions } from '../../model/constants';
import MarkdownTextarea from '../../../../shared/markdown-textarea/ui/ui/MarkdownTextarea';
import { loadUserTags } from '../../../settings/model/tagActions';
import { type ITagItem } from '../../../settings/ui/Tags/tagTypes';
import AuthExports from '../../../../shared/context/AuthContext';
import TagSelect from '../TagSelect/TagSelect';
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
      let timerId: NodeJS.Timeout;

      if (isNoteSaved) {
         timerId = setTimeout(() => {
            setIsNoteSaved(false);
         }, 5000);
      }

      return () => {
         if (timerId) clearTimeout(timerId);
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
      <Flex align='center' className={styles.container}>
         <Form onFinish={onFinish} className={styles.form}>
            <Form.Item label='Название' required validateStatus={errors.title ? 'error' : ''} help={errors.title && 'Обязательное поле'} className={styles.formItem}>
               <Controller name='title' control={control} rules={{ required: true }} render={({ field }) => 
                  <Input disabled={!token} {...field} />
               } />
            </Form.Item>
            <Form.Item label='Тип записи' required validateStatus={errors.type ? 'error' : ''} help={errors.type && 'Обязательное поле'} className={styles.formItem}>
               <Controller name='type' control={control} rules={{ required: true }} render={({ field }) => 
                  <Select showSearch options={typeOptions} disabled={!token} {...field} />
               } />
            </Form.Item>
            <Form.Item label='Теги' className={styles.formItem}>
               <Controller name='tags' control={control} render={({ field }) =>
                  <TagSelect value={field.value} onChange={field.onChange} userTags={userTags} disabled={!token} />
               } />
            </Form.Item>
            <Form.Item label='Выполнить до' required validateStatus={errors.date ? 'error' : ''} help={errors.date && 'Обязательное поле'} className={styles.formItem}>
               <Controller name='date' control={control} rules={{ required: true }} render={({ field }) => 
                  <DatePicker disabled={!token} className={!token ? styles.dateDisabled : ''} {...field} />
               } />
            </Form.Item>
            <Form.Item label='Описание' className={styles.formItem}>
               <Controller name='description' control={control} render={({ field }) => (
                     <MarkdownTextarea onFormattedChange={(formattedText: string) => setFormattedDescription(formattedText)} disabled={!token} {...field} />
                  )}
               />
            </Form.Item>
            <Button color="default" variant="solid" htmlType='submit' disabled={!token}>Создать</Button>
         </Form>
         {isNoteSaved && 
            <span className='success-response'>Запись успешно сохранена</span>
         }
      </Flex>
      
   )
}

export default NewNoteForm;