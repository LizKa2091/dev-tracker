export type NotificationType = 'commit' | 'success' | 'fail' | 'gainXp' | 'loseXp';

export interface INotification {
   id: number;
   message: string;
   repName?: string;
   noteTitle?: string;
   date: string;
   xp?: number | undefined;
   health?: number| undefined;
}