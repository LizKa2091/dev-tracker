import type { FC } from 'react'
import NotificationItem from './NotificationItem';
import type { INotification } from '../notificationTypes';
import { useCommitNotifications } from '../lib/useCommitNotification';
import { Flex } from 'antd';

const Notifications: FC = () => {
   const { notificationsData, removeNotification } = useCommitNotifications();

   if (!notificationsData.length) return null;

   return (
      <Flex>
         {notificationsData.map((notif: INotification) => 
            <NotificationItem 
               key={notif.id} 
               id={notif.id}
               message={notif.message} 
               repName={notif.repName} 
               date={notif.date}
               handleClose={removeNotification} 
            />
         )}
      </Flex>
   )
}

export default Notifications;