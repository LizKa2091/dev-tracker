import { createContext, useContext, useState, type FC, type ReactNode } from "react";
import type { INotification } from "../notificationTypes";

interface INotificationsContext {
   notificationsData: INotification[];
   addNotification: (notification: Omit<INotification, 'id'>) => void;
   removeNotification: (id: number) => void;
}

interface INotificationsContextProvider {
   children: ReactNode;
}

const NotificationsContext = createContext<INotificationsContext | undefined>(undefined);

const NotificationsContextProvider: FC<INotificationsContextProvider> = ({ children }) => {
   const [notificationsData, setNotificationsData] = useState<INotification[]>([]);

   let nextNotifId: number = 0;

   const addNotification = (notification: Omit<INotification, 'id'>): void => {
      nextNotifId++;
      setNotificationsData(prev => [
         ...prev,
         { ...notification, id: Date.now() + nextNotifId }
      ]);
   };

   const removeNotification = (id: number): void => {
      setNotificationsData(prev => prev.filter(notif => notif.id !== id));
   };

   return (
      <NotificationsContext.Provider value={{ notificationsData, addNotification, removeNotification }}>
         {children}
      </NotificationsContext.Provider>
   )
};

const useNotifications = (): INotificationsContext => {
   const context = useContext(NotificationsContext);
   if (!context) throw new Error('useNotifications должен быть внутри контекста');

   return context;
};

const NotificationsExports = { NotificationsContext, NotificationsContextProvider, useNotifications };

export default NotificationsExports;