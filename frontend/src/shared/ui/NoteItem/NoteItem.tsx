import { type FC } from 'react'
import type { INoteItem } from '../../../features/notes/noteTypes';
import { Badge, Card, Space, Tag } from 'antd';
import styles from './NoteItem.module.scss';

interface INoteItemProps {
   noteItemData: INoteItem;
};

const NoteItem: FC<INoteItemProps> = ({ noteItemData }) => {
   return (
      <Card title={noteItemData.title} extra={<Tag color='blue'>{noteItemData.type}</Tag>} className={noteItemData.tags?.length ? styles.card : ''}>
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