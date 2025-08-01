import type { TimelineItem } from "./timelineTypes";

export const useTimeline = (segment: string): TimelineItem[] => {
   const items: TimelineItem[] = [{ color: 'green', children: 'create DevTracker 19.07.2025' }];
   console.log(segment);

   return items;
};