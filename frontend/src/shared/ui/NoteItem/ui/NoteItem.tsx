import { useEffect, useState, type FC } from 'react'
import type { INoteItem } from '../../../../features/notes/noteTypes';
import { Badge, Button, Card, Flex, Space, Tag } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { changeNoteStatus } from '../model/changeNoteStatus';
import styles from './NoteItem.module.scss';

interface INoteItemProps {
   noteItemData: INoteItem;
   handleDeleteNote: (noteKey: string) => void;
};

const NoteItem: FC<INoteItemProps> = ({ noteItemData, handleDeleteNote }) => {
   const [currNote, setCurrNote] = useState<INoteItem>(noteItemData);
   const [isConfirmed, setIsConfirmed] = useState<boolean | null>(null);
   const [isCompleted, setIsCompleted] = useState<boolean>(noteItemData.status === 'completed');

   useEffect(() => {
      if (isConfirmed) {
         handleDeleteNote(noteItemData.key);
      }
   }, [isConfirmed])

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

      if (newStatus === 'completed') setIsCompleted(true);
      else setIsCompleted(false);
   };

   return (
      <Card title={
         <Flex align='center' gap='small'>
            {currNote.title}
         </Flex>
      }
         extra={
            <Space className={styles.spaceExtra}>
               <Tag color='blue'>{currNote.type}</Tag>
               {isCompleted ? (
                  <p className={styles.completed}>Выполнено</p>
               ) : (
                  <Button onClick={() => handleChangeStatus(currNote.key)} className={styles.markButton}>Пометить как выполненное</Button>
               )}
               <Button danger onClick={handleButtonDelete} icon={<DeleteOutlined />} className={styles.delButton}>{isConfirmed === null ? 'Удалить' : isConfirmed === false ? 'Вы уверены?' : ''}</Button>
            </Space>
         }
         className={currNote.tags?.length ? styles.card : ''}
      >
         <Space direction='vertical'>
            {currNote.formattedDescription ? (
               <div dangerouslySetInnerHTML={{ __html: currNote.formattedDescription }} />
            ) : (
               <Flex gap='small'>
                  <p className={styles.cardDetail}>{currNote.description || 'Нет описания'}</p>
               </Flex>
            )}
            <Flex gap='small'>
               <p className={styles.cardDetail}>Выполнить до: {currNote.date}</p>
            </Flex>
            <Space>
               {currNote.tags?.map(tag => 
                  <Badge key={tag} count={tag} text={tag} />
               )}
            </Space>
         </Space>
      </Card>
   )
}

export default NoteItem;