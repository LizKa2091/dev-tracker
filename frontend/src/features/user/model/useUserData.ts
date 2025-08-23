import { useQuery } from "@tanstack/react-query";
import type { IUserDataResponse } from "../userTypes";
import { defaultTokenApiAxios } from "../../../shared/api/axios";

export const useUserData = (token: string | null) => {
   return useQuery<IUserDataResponse, Error>({
      queryKey: ['userData', token],
      queryFn: async () => {
         const { data } = await defaultTokenApiAxios.get<IUserDataResponse>('/me');
         return data;
      },
      enabled: !!token,
      retry: 1
   })
};