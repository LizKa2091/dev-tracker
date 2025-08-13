import { useMutation } from "@tanstack/react-query";

type actionValues = 'add' | 'remove';

interface IXpActionResponse {
   xp: number;
   level?: number;
   currentXP?: number;
   xpForNextLevel?: number;
};

const xpAction = async (action: actionValues, amount: number, token: string): Promise<IXpActionResponse> => {
   const response = await fetch(`http://localhost:5001/xp/${action}`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         'authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ amount })
   });

   if (!response.ok) throw new Error('ошибка сервера');

   const result = await response.json();
   return result;
};

export const useXpAction = (action: actionValues) => {
   return useMutation<IXpActionResponse, Error, { amount: number; token: string }>({
      mutationKey: [`xp ${action}`],
      mutationFn: ({ amount, token }) => xpAction(action, amount, token),
      retry: 1
   })
};