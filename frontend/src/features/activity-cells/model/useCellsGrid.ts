import dayjs from 'dayjs';
import type { ICellItemData, IGridCell } from './../activityCellTypes';

interface IWeekItem {
   days: IGridCell[];
   monthLabel?: string
};

export const useCellsGrid = (cellItems: ICellItemData[], year: number = 2025) => {
   if (cellItems.length === 0) return { weeks: [] };

   const today = dayjs();
   const startOfYear = dayjs(`${year}-01-01`);

   const diffToMonday = (startOfYear.day() + 6) % 7;
   const gridStart = startOfYear.subtract(diffToMonday, 'day');

   const diffToSunday = today.day() === 0 ? 0 : 7 - today.day();
   const gridEnd = today.add(diffToSunday, 'day');

   const weeks: IWeekItem[] = [];
   let current = gridStart.clone();
   let currentWeek: IGridCell[] = [];

   while (current.isBefore(gridEnd) || current.isSame(gridEnd, 'day')) {
      const destinDay = cellItems.find(c => dayjs(c.day).isSame(current, 'day'));
      
      const isPrevYear = current.year() < year || current.isBefore(startOfYear, 'day');
      const isFuture = current.isAfter(today, 'day');

      currentWeek.push({
         day: current.format("YYYY-MM-DD"),
         activities: destinDay?.activities ?? 0,
         isHidden: isPrevYear || isFuture
      });

      if (current.day() === 0) {
         const monthLabel = currentWeek.some(c => c && dayjs(c.day).date() <= 7) ? current.format("MMM") : undefined;

         weeks.push({ days: currentWeek, monthLabel });
         currentWeek = [];
      }

      current = current.add(1, "day");
   }

   return { weeks };
};