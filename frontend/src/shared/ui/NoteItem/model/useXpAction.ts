import { useMutation } from "@tanstack/react-query";

type actionValues = 'add' | 'remove';

interface IXpActionResponse {
   xp: number;
   level?: number;
   currentXP?: number;
   xpForNextLevel?: number;
};

const xpAction = async (action: actionValues, token: string): Promise<IXpActionResponse> => {
   const response = await fetch(`http://localhost:5001/xp/${action}`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         'authorization': `Bearer ${token}`
      }
   });

   const result = await response.json();
   if (!response.ok) throw new Error(result.message || 'ошибка сервера');

   return result;
};

export const useXpAction = (token: string | null) => {
   const mutation = useMutation<IXpActionResponse, Error, actionValues>({
      mutationKey: ['xpAction', token],
      mutationFn: async (action) => {
         if (!token) throw new Error('не предоставлен токен');

         return await xpAction(action, token)
      },
      retry: 1
   });

   return { ...mutation, addXp: () => mutation.mutateAsync('add'), removeXp: () => mutation.mutateAsync('remove') };
};