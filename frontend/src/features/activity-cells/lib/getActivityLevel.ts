export const getActivityLevel = (activities: number, max: number): number => {
   if (activities === 0) return 0;

   const ratio = activities / max;

   if (ratio <= 0.2) return 1;
   if (ratio <= 0.4) return 2;
   if (ratio <= 0.6) return 3;
   if (ratio <= 0.8) return 4;

   return 5;
}