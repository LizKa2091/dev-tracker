import type { FC } from 'react';
import { Flex } from 'antd';
import NotificationItem from '../NotificationItem/NotificationItem';
import NotificationsExports from '../../model/NotificationsContext';
import { useMissedDeadlinesNotifications } from '../../../../features/missed-deadline/model/useMissedDeadlinesNotification';
import { useCommitNotifications } from '../../model/useCommitNotification';
import { useCompletedNoteNotification } from '../../model/useCompletedNoteNotification';
import { usePurchaseNotification } from '../../../../features/shop-buy-item/model/usePurchaseNotification';
import type { INotification } from '../../notificationTypes';
import styles from './Notifications.module.scss';

const Notifications: FC = () => {
   const { notificationsData, removeNotification } = NotificationsExports.useNotifications();

   useMissedDeadlinesNotifications();
   useCommitNotifications();
   useCompletedNoteNotification();
   usePurchaseNotification();

   if (!notificationsData.length) return null;

   return (
      <Flex vertical gap='middle' className={styles.container}>
         {notificationsData.map((notif: INotification) =>    
            <NotificationItem 
               key={notif.id} 
               id={notif.id}
               message={notif.message} 
               repName={notif.repName || ''}
               noteTitle={notif.noteTitle || ''}
               notificationTitle={notif.notificationTitle || ''}
               date={notif.date || ''}
               xp={notif.xp || undefined}
               health={notif.health || undefined}
               type={notif.type || 'info'}
               handleClose={removeNotification}
            />
         )}
      </Flex>
   )
}

export default Notifications;