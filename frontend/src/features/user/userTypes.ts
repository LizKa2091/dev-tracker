export interface IUserDataResponse {
   email: string;
   level: number;
   name: string;
   xp: number;
   xpForNextLevel: number;
   profilePic: string | null;
   difficulty: Difficulty;
   health: number;
};

export type Difficulty = 'default' | 'hard';