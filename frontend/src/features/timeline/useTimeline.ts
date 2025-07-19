import type { ITimelineItem } from "./timelineTypes";

export const useTimeline = (): ITimelineItem[] => {
   const items: ITimelineItem[] = [{ color: 'green', children: 'create DevTracker 19.07.2025' }];

   return items;
};