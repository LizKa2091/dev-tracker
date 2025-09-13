export type NotificationType = 'commit' | 'success' | 'error' | 'warning' | 'info';

export interface INotification {
   id: number;
   message: string;
   repName?: string;
   noteTitle?: string;
   notificationTitle?: string
   date?: string;
   xp?: number | undefined;
   health?: number| undefined;
   type?: NotificationType;
}