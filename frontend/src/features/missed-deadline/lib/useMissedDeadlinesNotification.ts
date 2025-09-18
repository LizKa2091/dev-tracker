import { useEffect, useRef, useState } from "react";
import { getMissedDeadlines } from "../model/getMissedDeadlines";
import AuthExports from "../../../shared/context/AuthContext";
import NotificationsExports from "../../../shared/notifications/model/NotificationsContext";
import type { INoteItem } from "../../notes/noteTypes";
import { loadShownDeadlines, saveShownDeadlines } from "../model/loadShownDeadlines";
import { useHealthAction } from "../../../shared/note-item/model/useHealthAction";

export const useMissedDeadlinesNotifications = () => {
   const { addNotification, removeNotification } = NotificationsExports.useNotifications();
   const { checkLoginStatus, token } = AuthExports.useAuthContext();
   const { mutate: healthAction } = useHealthAction(token);

   const [difficulty, setDifficulty] = useState<'default' | 'hard' | null>(null);
   const shownDeadlinesRef = useRef<Set<string>>(loadShownDeadlines());

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
         if (!shownDeadlinesRef.current.has(deadline.key)) {
            addNotification({
               noteTitle: deadline.title,
               message: 'Просрочен дедлайн',
               date: deadline.dueToDate,
               health: healthToLose,
               type: 'error'
            });

            healthAction('remove');
            shownDeadlinesRef.current.add(deadline.key);
            saveShownDeadlines(shownDeadlinesRef.current);
         }
      });
   }, [difficulty, addNotification, healthAction]);

   return { removeNotification };
};