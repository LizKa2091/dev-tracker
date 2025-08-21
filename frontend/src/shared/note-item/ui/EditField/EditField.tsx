import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Flex, Input } from 'antd';
import { useState, type FC } from 'react';
import styles from './EditField.module.scss';
import type { INoteItem } from '../../../../features/notes/noteTypes';
import { updateNote } from '../../../../features/notes/model/noteStorage';
import MarkdownTextarea from '../../../markdown-textarea/ui/ui/MarkdownTextarea';

interface IEditFieldProps {
   value: string;
   field: keyof INoteItem;
   note: INoteItem;
   onSave: (noteData: INoteItem) => void;
}

const EditField: FC<IEditFieldProps> = ({ value, field, note, onSave }) => {
   const [isEditing, setIsEditing] = useState<boolean>(false);
   const [tempVal, setTempVal] = useState<string>(value);
   const [formattedVal, setFormattedVal] = useState<string>(note.formattedDescription || '');

   const handleSave = (): void => {
      if (tempVal.trim() !== value || (field === 'description' && formattedVal !== note.formattedDescription)) {
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
         <Button size='small' icon={<EditOutlined />} onClick={() => setIsEditing(true)} className={styles.editButton} />
      )
   }

   return (
      <Flex>
         {field === 'description' ? (
               <MarkdownTextarea value={tempVal} onChange={(val: string) => setTempVal(val)} onFormattedChange={(formVal) => setFormattedVal(formVal)} />
         ) : (
               <Input size='small' value={tempVal} onChange={(e) => setTempVal(e.target.value)} />
         )}
         <Button size='small' icon={<CheckOutlined />} onClick={handleSave} />
         <Button size='small' icon={<CloseOutlined />} onClick={handleCancel} />
      </Flex>
   )
}

export default EditField;