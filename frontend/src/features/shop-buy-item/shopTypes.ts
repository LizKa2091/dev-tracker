export interface IShopItem {
   id: string,
   name: string,
   cost: number,
   description: string,
   image: string,
   effect: any,
};

export interface IShopItemsResponse {
   shopItems: IShopItem[];
}

export interface IBuyItemResponse {
   message: string;
};