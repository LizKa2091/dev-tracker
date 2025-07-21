import { type FC } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Form, Input, Button, Select, DatePicker } from 'antd';
import styles from './NewNoteForm.module.scss';

type NewNoteFormData = {
   title: string;
   type: string;
   tags: [];
   date: number;
   description: string;
};

const typeOptions = [
   { value: 'Багфикс', label: 'Багфикс' },
   { value: 'Учёба', label: 'Учёба' },
   { value: 'Идея', label: 'Идея' },
   { value: 'Спорт', label: 'Спорт' },
   { value: 'Другое', label: 'Другое' },
];

const tagOptions = [
   { value: 'React', label: 'React' },
   { value: 'TypeScript', label: 'TypeScript' },
   { value: 'JavaScript', label: 'JavaScript' },
   { value: 'C++', label: 'C++' },
   { value: 'C#', label: 'C#' },
   { value: 'Python', label: 'Python' },
   { value: 'Java', label: 'Java' },
   { value: 'Другое', label: 'Другое' },
];

const NewNoteForm: FC = () => {
   const { handleSubmit, control } = useForm<NewNoteFormData>();

   const onSubmit = (data: NewNoteFormData): void => {
      console.log(data);
   };

   return (
      <Form onFinish={handleSubmit(onSubmit)}>
         <Form.Item label='Название' className={styles.formItem}>
            <Controller name='title' control={control} rules={{ required: true }} render={({ field }) => <Input {...field} />} />
         </Form.Item>
         <Form.Item label='Тип записи' className={styles.formItem}>
            <Controller name='type' control={control} rules={{ required: true }} render={({ field }) => <Select showSearch options={typeOptions} {...field} />} />
         </Form.Item>
         <Form.Item label='Теги' className={styles.formItem}>
            <Controller name='tags' control={control} render={({ field }) => <Select mode='tags' options={tagOptions} className={styles.formTags} {...field} />} />
         </Form.Item>
         <Form.Item label='Выполнить до' className={styles.formItem}>
            <Controller name='date' control={control} rules={{ required: true }} render={({ field }) => <DatePicker {...field} />} />
         </Form.Item>
         <Form.Item label='Описание' className={styles.formItem}>
            <Controller name='description' control={control} render={({ field }) => <Input {...field} />} />
         </Form.Item>
         <Button color="default" variant="solid" htmlType='submit'>Создать</Button>
      </Form>
   )
}

export default NewNoteForm;