import { useMutation } from "@tanstack/react-query";

interface IChangePassResponse {
   message: string;
}

const changePassword = async (token: string, currPass: string, newPass: string): Promise<IChangePassResponse> => {
   const response = await fetch('http://localhost:5001/me/change-password', {
      method: 'POST',
      headers: {
         'authorization': `Bearer ${token}`,
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({ oldPassword: currPass, newPassword: newPass })
   });

   const result = await response.json();
   if (!response.ok) throw new Error(result?.message || 'Произошла ошибка при смене пароля');

   return result;
};

export const useChangePassword = (token: string | null) => {
   return useMutation<IChangePassResponse, Error, { currPass: string, newPass: string }>({
      mutationKey: ['userPassword', token],
      mutationFn: ({ currPass, newPass }) => {
         if (!token) throw new Error('не предоставлен токен для проверки авторизации пользователя');

         return changePassword(token, currPass, newPass);
      },
      retry: 1
   })
}