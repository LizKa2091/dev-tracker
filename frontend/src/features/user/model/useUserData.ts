import { useQuery } from "@tanstack/react-query";

interface IUserDataResponse {
   email: string;
   level: number;
   name: string;
   xp: number;
   xpForNextLevel: number;
};

const getUserData = async (token: string) => {
   const response = await fetch(`http://localhost:5001/me`, {
      method: 'GET',
      headers: {
         'Content-Type': 'application/json',
         'authorization': `Bearer ${token}`
      }
   });

   if (!response.ok) throw new Error('ошибка сервера');

   const result = await response.json();
   return result;
};

export const useUserData = (token: string | null) => {
   return useQuery<IUserDataResponse, Error>({
      queryKey: ['userData', token],
      queryFn: () => {
         if (!token) throw new Error('не предоставлен токен для проверки авторизации пользователя');

         return getUserData(token)
      },
      enabled: !!token,
      retry: 1
   })
};