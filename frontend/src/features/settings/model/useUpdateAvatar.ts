import { useMutation } from "@tanstack/react-query";
import { avatarAxios } from "../../../shared/api/axios";

interface IUpdateAvatarResponse {
   message: string;
   profilePic: string;
};

export const useUpdateAvatar = (token: string | null) => {
   return useMutation<IUpdateAvatarResponse, Error, { file: File }>({
      mutationKey: ['userAvatar', token],
      mutationFn: async ({ file }) => {
         const { data } = await avatarAxios.post<IUpdateAvatarResponse>('/me/avatar', { file });

         return data;
      },
      retry: 1
   })
};