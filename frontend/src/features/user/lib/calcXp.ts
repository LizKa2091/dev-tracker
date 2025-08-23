import type { IUserDataResponse } from "../userTypes";

export const calcXpForLevel = (level: number): number => {
   let res: number = 0;
   
   for (let i: number = 1; i<level; i++) {
      res += i*100;
   }

   return res;
};

export const calcProgress = (data: IUserDataResponse): number => {
   if (!data) return 0;

   const currLevelXp: number = data.xp - calcXpForLevel(data.level);

   return Math.round((currLevelXp / data.xpForNextLevel) * 100);
};