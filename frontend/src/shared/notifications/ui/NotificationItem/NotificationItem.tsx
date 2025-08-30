import { Alert, Flex } from 'antd';
import type { FC } from 'react';
import styles from './NotificationItem.module.scss';

interface INotificationItemProps {
   id: number;
   message: string;
   repName: string;
   date: string;
   xp: number;
   handleClose: (notifId: number) => void;
};

const NotificationItem: FC<INotificationItemProps> = ({ id, message, repName, date, xp, handleClose }) => {
   return (
      <Alert message={message} type='success' closable onClose={() => handleClose(id)} description={
         <Flex vertical>
            {xp > 0 ? (
                  <p className={styles.xpPlus}>+{xp} XP</p>
               ) : (
                  <p className={styles.xpMinus}>-{xp} XP</p>
               )
            }
            <p>Репозиторий: {repName}</p>
            {date && <p>Дата: {date}</p>}
         </Flex>
      } />
   )
}

export default NotificationItem;