import type { ReactNode } from "react";

export type TimelineItem = Record<string, string>;

export interface ISegmentedOption {
   label: string;
   value: string;
   icon?: ReactNode;
};