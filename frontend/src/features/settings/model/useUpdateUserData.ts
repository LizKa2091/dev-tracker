import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { IUserDataResponse } from "../../user/userTypes";

interface IUserUpdateResponse {
   message: string;
   token: string;
   user: IUserDataResponse;
}

const updateUserData = async (name: string, email: string, token: string): Promise<IUserUpdateResponse> => {
   const response = await fetch('http://localhost:5001/me', {
      method: 'PATCH',
      headers: {
         'authorization': `Bearer ${token}`,
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email })
   });

   const result = await response.json();
   return result;
};

export const useUpdateUserData = (token: string | null) => {
   const queryClient = useQueryClient();

   return useMutation<IUserUpdateResponse, Error, { name: string; email: string }>({
      mutationKey: ['userData', token],
      mutationFn: ({ name, email }) => {
         if (!token) throw new Error('не предоставлен токен для проверки авторизации пользователя');

         return updateUserData(name, email, token)
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userData', token] }),
      retry: 1
   })
}