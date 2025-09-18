import NotificationsExports from "../../../shared/notifications/model/NotificationsContext";
import type { NotificationType } from "../../../shared/notifications/notificationTypes";

export const usePurchaseNotification = () => {
   const { addNotification, removeNotification } = NotificationsExports.useNotifications();

   const notifyPurchase = (title: string, type: NotificationType) => {
      addNotification({ notificationTitle: title, message: '', type });
   }

   return { notifyPurchase, removeNotification };
}