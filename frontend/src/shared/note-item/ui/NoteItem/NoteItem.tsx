import dayjs from 'dayjs';
import { useEffect, useState, type FC } from 'react'
import type { INoteItem } from '../../../../features/notes/noteTypes';
import { Badge, Button, Card, Flex, Space, Tag } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { changeNoteStatus } from '../../model/changeNoteStatus';
import { useXpAction } from '../../model/useXpAction';
import EditField from '../EditField/EditField';
import AuthExports from '../../../context/AuthContext';
import styles from './NoteItem.module.scss';

interface INoteItemProps {
   noteItemData: INoteItem;
   handleDeleteNote: (noteKey: string) => void;
   disabled?: boolean;
};

const NoteItem: FC<INoteItemProps> = ({ noteItemData, handleDeleteNote, disabled }) => {
   const { token } = AuthExports.useAuthContext();
   const [currNote, setCurrNote] = useState<INoteItem>(noteItemData);
   const [isConfirmed, setIsConfirmed] = useState<boolean | null>(null);
   const [isCompleted, setIsCompleted] = useState<boolean>(noteItemData.status === 'completed');

   const { addXp } = useXpAction(token);

   useEffect(() => {
      if (isConfirmed) {
         handleDeleteNote(noteItemData.key);
      }
   }, [isConfirmed, handleDeleteNote, noteItemData.key])

   const handleButtonDelete = (): void => {
      if (isConfirmed === null) {
         setIsConfirmed(false);
      }
      else if (isConfirmed === false) {
         setIsConfirmed(true);
      }
   };

   const handleChangeStatus = (key: string): void => {
      const newStatus = changeNoteStatus(key);

      if (newStatus === 'completed') {
         setIsCompleted(true);
         addXp();
      }
      else setIsCompleted(false);
   };

   const handleUpdateNote = (updatedNoteData: INoteItem): void => {
      setCurrNote(updatedNoteData);
   };

   return (
      <Card title={
         <Flex align='center' gap='small'>
            {currNote.title}
            <EditField value={currNote.title} field='title' note={currNote} onSave={handleUpdateNote} />
         </Flex>
      }
         extra={
            <Space className={styles.spaceExtra}>
               <Tag color='blue'>{currNote.type}</Tag>
               {isCompleted ? (
                  <p className={styles.completed}>Выполнено</p>
               ) : (
                  <Button onClick={() => handleChangeStatus(currNote.key)} disabled={disabled} className={styles.markButton}>Пометить как выполненное</Button>
               )}
               <Button danger onClick={handleButtonDelete} icon={<DeleteOutlined />} disabled={disabled} className={styles.delButton}>
                  {isConfirmed === null ? 'Удалить' : isConfirmed === false ? 'Вы уверены?' : ''}
               </Button>
            </Space>
         }
         className={currNote.tags?.length ? styles.card : ''}
      >
         <Space direction='vertical'>
            {currNote.formattedDescription ? (
               <Flex align='center' gap='small'>
                  <div dangerouslySetInnerHTML={{ __html: currNote.formattedDescription }} />
                  <EditField value={currNote.description || ''} field='description' note={currNote} onSave={handleUpdateNote} />
               </Flex>
            ) : (
               <Flex align='center' gap='small'>
                  <p className={styles.cardDetail}>{currNote.description || 'Нет описания'}</p>
                  <EditField value={currNote.description || ''} field='description' note={currNote} onSave={handleUpdateNote} />
               </Flex>
            )}
            <Flex align='center' gap='small'>
               <p className={styles.cardDetail}>Выполнить до: {dayjs(currNote.date).format('DD.MM.YYYY')}</p>
               <EditField value={String(currNote.date)} field='date' note={currNote} onSave={handleUpdateNote} />
            </Flex>
            <Space>
               {currNote.tags?.map(tag => 
                  <Badge key={tag.key} color={tag.color || '#888'} text={tag.value} className={styles.badge} />
               )}
            </Space>
         </Space>
      </Card>
   )
}

export default NoteItem;