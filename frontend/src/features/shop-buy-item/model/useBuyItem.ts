import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { IBuyItemResponse } from './../shopTypes';
import { defaultTokenApiAxios } from "../../../shared/api/axios";

export const useBuyItem = () => {
   const queryClient = useQueryClient();

   return useMutation<IBuyItemResponse, Error, { itemId: string }>({
      mutationKey: ['buyItem'],
      mutationFn: async ({ itemId }) => {
         const { data } = await defaultTokenApiAxios.post<IBuyItemResponse>('/shop/buy', { itemId });
         return data;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userData'] }),
      retry: 1
   })
};