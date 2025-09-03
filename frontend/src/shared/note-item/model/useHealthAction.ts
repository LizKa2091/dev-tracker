import { useMutation } from "@tanstack/react-query";
import { defaultTokenApiAxios } from "../../api/axios";
import { useQueryClient } from "@tanstack/react-query";

type ActionValues = 'add' | 'remove';

interface IHealthActionResponse {
   message: string;
   health: number;
   delta: number;
   dead?: boolean;
};

export const useHealthAction = (token: string | null) => {
   const queryClient = useQueryClient();

   return useMutation<IHealthActionResponse, Error, ActionValues>({
      mutationKey: ['userHealth', token],
      mutationFn: async (action: ActionValues) => {
         if (!token) throw new Error('нет токена');

         const { data } = await defaultTokenApiAxios.post<IHealthActionResponse>(`/health/${action}`);
         return data;
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['userData'] })
      },
      retry: 1
   })
}