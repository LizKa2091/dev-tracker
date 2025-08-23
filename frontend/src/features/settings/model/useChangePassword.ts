import { useMutation } from "@tanstack/react-query";
import { defaultTokenApiAxios } from "../../../shared/api/axios";

interface IChangePassResponse {
   message: string;
};

export const useChangePassword = (token: string | null) => {
   return useMutation<IChangePassResponse, Error, { currPass: string, newPass: string }>({
      mutationKey: ['userPassword', token],
      mutationFn: async ({ currPass, newPass }) => {
         const { data } = await defaultTokenApiAxios.post<IChangePassResponse>('/me/change-password',
            { oldPassword: currPass, newPassword: newPass }
         );

         return data;
      },
      retry: 1
   })
}