import { useEffect, useState, type FC } from 'react'
import type { INoteItem } from '../../../features/notes/noteTypes';
import { Badge, Button, Card, Space, Tag } from 'antd';
import styles from './NoteItem.module.scss';
import { DeleteOutlined } from '@ant-design/icons';
import { deleteNote } from '../../../features/notes/model/noteStorage';

interface INoteItemProps {
   noteItemData: INoteItem;
   handleDeleteNote: (noteKey: string) => void;
};

const NoteItem: FC<INoteItemProps> = ({ noteItemData, handleDeleteNote }) => {
   const [isConfirmed, setIsConfirmed] = useState<boolean | null>(null);

   useEffect(() => {
      if (isConfirmed) {
         handleDeleteNote(noteItemData.key);
      }
   }, [isConfirmed])

   const handleButtonDelete = () => {
      if (isConfirmed === null) {
         setIsConfirmed(false);
      }
      else if (isConfirmed === false) {
         setIsConfirmed(true);
      }
   };

   return (
      <Card title={noteItemData.title} 
         extra={
            <Space className={styles.spaceExtra}>
               <Tag color='blue'>{noteItemData.type}</Tag>
               <Button onClick={handleButtonDelete} icon={<DeleteOutlined />}>{isConfirmed === null ? 'Удалить' : isConfirmed === false ? 'Вы уверены?' : ''}</Button>
            </Space>
         }
         className={noteItemData.tags?.length ? styles.card : ''}
      >
         <Space direction='vertical'>
            {noteItemData.formattedDescription ? (
               <div dangerouslySetInnerHTML={{ __html: noteItemData.formattedDescription }} />
            ) : (
               <p className={styles.cardDetail}>{noteItemData.description || 'Нет описания'}</p>
            )}
            <p className={styles.cardDetail}>Выполнить до: {noteItemData.date}</p>
            <Space>
               {noteItemData.tags?.map(tag => 
                  <Badge key={tag} count={tag} text={tag} />
               )}
            </Space>
         </Space>
      </Card>
   )
}

export default NoteItem;