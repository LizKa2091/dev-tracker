import { useQuery } from "@tanstack/react-query";
import { shopItemsAxios } from "../../../shared/api/axios";
import type { IShopItemsResponse } from './../shopTypes';

export const useShopItems = () => {
   return useQuery<IShopItemsResponse, Error>({
      queryKey: ['shopItems'],
      queryFn: async () => {
         const { data } = await shopItemsAxios.get<IShopItemsResponse>('/shop/items');
         return data;
      }
   })
}