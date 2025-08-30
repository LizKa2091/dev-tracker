import { Alert, Flex } from 'antd';
import type { FC } from 'react';

interface INotificationItemProps {
   id: number;
   message: string;
   repName: string;
   date: string;
   xp?: number;
   handleClose: (notifId: number) => void;
};

const NotificationItem: FC<INotificationItemProps> = ({ id, message, repName, date, xp, handleClose }) => {
   return (
      <Alert message={message} type='success' closable onClose={() => handleClose(id)} description={
         <Flex vertical>
            {xp && <p>+{xp} XP</p>}
            <p>Репозиторий: {repName}</p>
            <p>Дата: {date}</p>
         </Flex>
      } />
   )
}

export default NotificationItem;