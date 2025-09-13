import { useEffect } from "react";
import AuthExports from "../../../shared/context/AuthContext";
import NotificationsExports from "../../../shared/notifications/model/NotificationsContext";
import type { NotificationType } from "../../../shared/notifications/notificationTypes";

export const usePurchaseNotification = () => {
   const { addNotification, removeNotification } = NotificationsExports.useNotifications();
   const { isAuthed } = AuthExports.useAuthContext();

   useEffect(() => {
      if (!isAuthed) {
         console.error('Пользователь не авторизован')
      }
   }, [isAuthed]);

   const notifyPurchase = (title: string, message: string, type: NotificationType) => {
      if (!isAuthed) return;

      addNotification({ notificationTitle: title, message, type });
   }

   return { notifyPurchase, removeNotification };
}