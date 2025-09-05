import { useEffect, useRef, useState } from "react";
import { getMissedDeadlines } from "../model/getMissedDeadlines";
import AuthExports from "../../../shared/context/AuthContext";
import NotificationsExports from "../../../shared/notifications/model/NotificationsContext";
import type { INoteItem } from "../../notes/noteTypes";

export const useMissedDeadlinesNotifications = () => {
   const { addNotification, removeNotification } = NotificationsExports.useNotifications();
   const { checkLoginStatus } = AuthExports.useAuthContext();
   const notifyRef = useRef<Set<string>>(new Set());

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

   useEffect(() => {
      if (difficulty === null) return;

      const missedDeadlines = getMissedDeadlines();
      if (!missedDeadlines?.length) return;

      const healthToLose: number = difficulty === 'hard' ? -3 : -2;

      missedDeadlines.forEach((deadline: INoteItem) => {
         if (!notifyRef.current.has(deadline.title)) {
            addNotification({
               noteTitle: deadline.title,
               message: 'Просрочен дедлайн',
               date: deadline.dueToDate,
               health: healthToLose
            });
            notifyRef.current.add(deadline.title);
         }
      });
   }, [difficulty, addNotification]);

   return { removeNotification };
};