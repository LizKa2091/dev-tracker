import { useMutation } from "@tanstack/react-query";

interface IUpdateAvatarResponse {
   message: string;
   profilePic: string;
}

const updateAvatar = async (token: string, file: File): Promise<IUpdateAvatarResponse> => {
   const formData = new FormData();
   formData.append('avatar', file);

   const response = await fetch('http://localhost:5001/me/avatar', {
      method: 'POST',
      headers: {
         'authorization': `Bearer ${token}`
      },
      body: formData
   });

   const result = await response.json();
   if (!response.ok) throw new Error(result.message || 'Произошла ошибка при обновлении аватара');

   return result;
};

export const useUpdateAvatar = (token: string | null) => {
   return useMutation<IUpdateAvatarResponse, Error, { file: File }>({
      mutationKey: ['userAvatar', token],
      mutationFn: ({ file }) => {
         if (!token) throw new Error('не предоставлен токен для проверки авторизации пользователя');

         return updateAvatar(token, file);
      },
      retry: 1
   })
};