import type { FC } from 'react';
import { Alert, Flex } from 'antd';
import styles from './NotificationItem.module.scss';

interface INotificationItemProps {
   id: number;
   message: string;
   repName: string;
   noteTitle: string;
   date: string;
   xp: number | undefined;
   health: number | undefined;
   handleClose: (notifId: number) => void;
};

const NotificationItem: FC<INotificationItemProps> = ({ id, message, repName, noteTitle, date, xp, health, handleClose }) => {
   return (
      <Alert message={message} type='success' closable onClose={() => handleClose(id)} className={styles.container} description={
         <Flex vertical>
            {xp !== undefined && (
               <p className={xp > 0 ? styles.xpPlus : styles.xpMinus}>
                  {xp > 0 ? `+${xp} XP` : `${xp} XP`}
               </p>
            )}

            {health !== undefined && (
               <p className={health > 0 ? styles.healthPlus : styles.healthMinus}>
                  {health > 0 ? `+${health} здоровья` : `${health} здоровья`}
               </p>
            )}
            {repName && <p>Репозиторий: {repName}</p>}
            {noteTitle && <p>Заметка: {noteTitle}</p>}
            {date && <p>Дата: {date.split('T')[0]}</p>}
         </Flex>
      } />
   )
}

export default NotificationItem;