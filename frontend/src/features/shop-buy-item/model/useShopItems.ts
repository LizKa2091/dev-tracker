import { useQuery } from "@tanstack/react-query";
import { defaultTokenApiAxios } from "../../../shared/api/axios";
import type { IShopItem } from './../shopTypes';

export const useShopItems = () => {
   return useQuery({
      queryKey: ['shopItems'],
      queryFn: async () => {
         const { data } = await defaultTokenApiAxios.get<IShopItem[]>('/shop/items');
         return data;
      }
   })
}