import type { FC } from 'react';
import { Flex } from 'antd';
import NotificationItem from '../NotificationItem/NotificationItem';
import type { INotification } from '../../notificationTypes';
import { useCommitNotifications } from '../../lib/useCommitNotification';
import styles from './Notifications.module.scss';

const Notifications: FC = () => {
   const { notificationsData, removeNotification } = useCommitNotifications();

   if (!notificationsData.length) return null;

   return (
      <Flex vertical gap='middle' className={styles.container}>
         {notificationsData.map((notif: INotification) => 
            <NotificationItem 
               key={notif.id} 
               id={notif.id}
               message={notif.message} 
               repName={notif.repName} 
               date={notif.date}
               xp={notif.xp}
               handleClose={removeNotification} 
            />
         )}
      </Flex>
   )
}

export default Notifications;