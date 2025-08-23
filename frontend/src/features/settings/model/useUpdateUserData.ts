import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { IUserDataResponse } from "../../user/userTypes";
import { defaultTokenApiAxios } from "../../../shared/api/axios";

interface IUserUpdateResponse {
   message: string;
   token: string;
   user: IUserDataResponse;
}

export const useUpdateUserData = (token: string | null) => {
   const queryClient = useQueryClient();

   return useMutation<IUserUpdateResponse, Error, { name: string; email: string }>({
      mutationKey: ['userData', token],
      mutationFn: async ({ name, email }) => {
         const { data } = await defaultTokenApiAxios.patch<IUserUpdateResponse>('/me', { name, email });
         return data;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userData', token] }),
      retry: 1
   })
}