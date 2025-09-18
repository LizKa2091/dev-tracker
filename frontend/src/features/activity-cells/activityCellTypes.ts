export interface ICellsData {
   totalCells: number;
   years: number[];
   cellItems: ICellItemData[]
};

export interface ICellItemData {
   day: string;
   activities: number;
};

export interface IGridCell {
  day: string;
  activities: number;
  isHidden: boolean;
}