import { useEffect, useState } from "react";
import AuthExports from "../../context/AuthContext";
import NotificationsExports from "../model/NotificationsContext"

export const useCompletedNoteNotification = () => {
   const { addNotification, removeNotification } = NotificationsExports.useNotifications();
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

   const notifyCompletedNote = (noteTitle: string, date: string) => {
      if (difficulty === null) return;

      const xpToGain: number = difficulty === 'hard' ? 12 : 20;

      addNotification({ noteTitle, message: 'Выполнено задание', type: 'success', date, xp: xpToGain });
   }

   return { notifyCompletedNote, removeNotification };
}