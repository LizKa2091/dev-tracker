import { useEffect } from "react";
import AuthExports from "../../../shared/context/AuthContext";
import NotificationsExports from "../../../shared/notifications/model/NotificationsContext";
import dayjs from "dayjs";

export const usePurchaseNotification = () => {
   const { addNotification, removeNotification } = NotificationsExports.useNotifications();
   const { isAuthed } = AuthExports.useAuthContext();

   useEffect(() => {
      if (!isAuthed) {
         console.error('Пользователь не авторизован')
      }
   }, [isAuthed]);

   const notifyPurchase = (title: string, message: string) => {
      if (!isAuthed) return;

      addNotification({ noteTitle: title, message, date: dayjs(new Date()).toISOString() });
   }

   return { notifyPurchase, removeNotification };
}