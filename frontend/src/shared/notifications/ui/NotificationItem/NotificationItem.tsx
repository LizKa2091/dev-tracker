import type { FC } from 'react';
import { Alert, Flex } from 'antd';
import type { NotificationType } from '../../notificationTypes';
import styles from './NotificationItem.module.scss';

interface INotificationItemProps {
   id: number;
   message: string;
   repName: string;
   noteTitle: string;
   notificationTitle: string;
   date: string;
   xp: number | undefined;
   health: number | undefined;
   type: NotificationType;
   handleClose: (notifId: number) => void;
};

const NotificationItem: FC<INotificationItemProps> = ({ id, message, repName, noteTitle, notificationTitle, date, xp, health, type, handleClose }) => {
   return (
      <Alert message={noteTitle ? message : notificationTitle} type={type === 'commit' ? 'success' : type} closable onClose={() => handleClose(id)} className={styles.container} description={
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
            {notificationTitle && !noteTitle && message && <p>{message}</p>}
            {repName && <p>Репозиторий: {repName}</p>}
            {noteTitle && !notificationTitle && <p>Заметка: {noteTitle}</p>}
            {date && <p>Дата: {date.split('T')[0]}</p>}
         </Flex>
      } />
   )
}

export default NotificationItem;