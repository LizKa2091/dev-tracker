import dayjs from 'dayjs';
import type { ICellItemData } from './../activityCellTypes';

export const useCellsGrid = (cellItems: ICellItemData[]) => {
   if (cellItems.length === 0) return { weeks: [] };

   const startDate = dayjs(cellItems[0].day).startOf('week');
   const endDate = dayjs(cellItems.at(-1)!.day).endOf('week');

   const weeks = [];
   let current = startDate.clone();
   let currentWeek = [];

   while (current.isBefore(endDate) || current.isSame(endDate, 'day')) {
      const destinDay = cellItems.find(c => dayjs(c.day).isSame(current, 'day'));

      currentWeek.push(destinDay ?? null);

      if (current.day() === 0) {
         const monthLabel = currentWeek.some(c => c && dayjs(c.day).date() <= 7) ? current.format("MMM") : undefined;

         weeks.push({ days: currentWeek, monthLabel });
         currentWeek = [];
      }

      current = current.add(1, "day");
   }

   return { weeks };
};