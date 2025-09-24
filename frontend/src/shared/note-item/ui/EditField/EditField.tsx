import dayjs, { Dayjs } from 'dayjs';
import { Button, DatePicker, Flex, Input, Grid } from 'antd';
import { useState, type FC } from 'react';
import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { updateNote } from '../../../../features/notes/model/noteStorage';
import MarkdownTextarea from '../../../markdown-textarea/ui/ui/MarkdownTextarea';
import type { INoteItem } from '../../../../features/notes/noteTypes';
import styles from './EditField.module.scss';

const { useBreakpoint } = Grid;

interface IEditFieldProps {
   value: string;
   field: keyof INoteItem;
   note: INoteItem;
   onSave: (noteData: INoteItem) => void;
}

const EditField: FC<IEditFieldProps> = ({ value, field, note, onSave }) => {
   const [isEditing, setIsEditing] = useState<boolean>(false);
   const [tempVal, setTempVal] = useState<string>(value);
   const [tempDate, setTempDate] = useState<Dayjs | null>(field === 'dueToDate' && value ? dayjs(value) : null);
   const [formattedVal, setFormattedVal] = useState<string>(note.formattedDescription || '');

   const screens = useBreakpoint();
   const isMobile = !screens.md;

   const handleSave = (): void => {
      if (field === 'dueToDate') {
         const updatedNoteData = { ...note, date: tempDate ? tempDate.toISOString() : ''};

         updateNote(updatedNoteData);
         onSave(updatedNoteData);
      }
      else if (tempVal.trim() !== value || (field === 'description' && formattedVal !== note.formattedDescription)) {
         const updatedNoteData = field === 'description' ? { ...note, description: tempVal.trim(), formattedDescription: formattedVal } :
         { ...note, [field]: tempVal.trim() };
         
         updateNote(updatedNoteData);
         onSave(updatedNoteData);
      }
      setIsEditing(false);
   };

   const handleCancel = (): void => {
      setTempVal(value);
      setFormattedVal(note.formattedDescription || '');
      setIsEditing(false);
   }

   if (!isEditing) {
      return (
         <Button 
            size={isMobile ? 'middle' : 'small'} 
            icon={<EditOutlined />} 
            onClick={() => setIsEditing(true)} 
            className={styles.editButton} 
         />
      )
   }

   return (
      <Flex vertical={isMobile && field === 'description'} data-editing='true' className={styles.editContainer}>
         {field === 'description' ? (
            <MarkdownTextarea value={tempVal} onChange={(val: string) => setTempVal(val)} onFormattedChange={(formVal) => setFormattedVal(formVal)} />
         ) : (
               field === 'dueToDate' ? (
                  <DatePicker value={tempDate} onChange={date => setTempDate(date)} />
                     ) : (
                        <Input value={tempVal} onChange={(e) => setTempVal(e.target.value)} />
         ))}
         <Flex>
            <Button size={isMobile ? 'middle' : 'small'} icon={<CheckOutlined />} onClick={handleSave} />
            <Button size={isMobile ? 'middle' : 'small'} icon={<CloseOutlined />} onClick={handleCancel} />
         </Flex>
      </Flex>
   )
}

export default EditField