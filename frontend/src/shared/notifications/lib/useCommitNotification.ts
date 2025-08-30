import NotificationsExports from "../model/NotificationsContext";

export const useCommitNotifications = () => {
   const { addNotification, removeNotification, notificationsData } = NotificationsExports.useNotifications();

   const notifyCommit = (repName: string, date: string, xp: number = 15) => {
      addNotification({ repName, message: `Новый коммит в ${repName}`, date, xp })
   };

   return { notificationsData, notifyCommit, removeNotification };
}