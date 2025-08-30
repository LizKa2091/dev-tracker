import { useEffect, useState } from "react";
import NotificationsExports from "../model/NotificationsContext";
import AuthExports from "../../context/AuthContext";

export const useCommitNotifications = () => {
   const { addNotification, removeNotification, notificationsData } = NotificationsExports.useNotifications();
   const { checkLoginStatus } = AuthExports.useAuthContext();

   const [difficulty, setDifficulty] = useState<'default' | 'hard' | null>(null);

   useEffect(() => {
      const getDifficulty = async (): Promise<void> => {
         try {
            const response = await checkLoginStatus();

            setDifficulty(response.difficulty);
         }
         catch (err) {
            console.error('ошибка при проверке сложности', err);
         }
      }

      getDifficulty();
   }, [checkLoginStatus]);

   const notifyCommit = (repName: string, date: string) => {
      const xpToGain: number = difficulty === 'hard' ? 12 : 20;

      addNotification({ repName, message: `Новый коммит в ${repName}`, date, xp: xpToGain })
   };

   return { notificationsData, notifyCommit, removeNotification };
}