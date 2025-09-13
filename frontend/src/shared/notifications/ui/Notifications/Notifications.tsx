import type { FC } from 'react';
import { Flex } from 'antd';
import NotificationItem from '../NotificationItem/NotificationItem';
import type { INotification } from '../../notificationTypes';
import { useMissedDeadlinesNotifications } from '../../../../features/missed-deadline/lib/useMissedDeadlinesNotification';
import { useCommitNotifications } from '../../lib/useCommitNotification';
import NotificationsExports from '../../model/NotificationsContext';
import styles from './Notifications.module.scss';
import { useCompletedNoteNotification } from '../../lib/useCompletedNoteNotification';
import { usePurchaseNotification } from '../../../../features/shop-buy-item/model/usePurchaseNotification';

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