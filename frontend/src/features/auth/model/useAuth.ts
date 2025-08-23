import { useMutation, useQuery } from '@tanstack/react-query';
import { defaultTokenApiAxios, apiAxios } from '../../../shared/api/axios';

interface IRequestResponseMessage {
   message: string;
};

interface ILoginRequestResponse {
   token: string;
};

type userData = {
   email: string;
   name: string;
   xp: number;
   profilePic: string;
}

interface IVerifyAuthStatusResponse {
   message: string;
   token: string;
   user: userData;
}

export const useRegisterUser = () => {
   return useMutation<IRequestResponseMessage, Error, {email: string, password: string, name: string}>({
      mutationKey: ['register'],
      mutationFn: async ({ email, password, name }) => {
         const { data } = await apiAxios.post<IRequestResponseMessage>('/register', { email, password, name });
         return data;
      },
      onError: (err: Error) => console.error(err.message), 
      retry: 1
   })
};

export const useLoginUser = () => {
   return useMutation<ILoginRequestResponse, Error, {email: string, password: string}>({
      mutationKey: ['login'],
      mutationFn: async ({ email, password }) => {
         const { data } = await apiAxios.post<ILoginRequestResponse>('/login', { email, password });
         return data;
      },
      onError: (err: Error) => console.error(err.message),
      retry: 1
   })
};

export const useLogoutUser = () => {
   return useMutation<IRequestResponseMessage, Error>({
      mutationKey: ['logout'],
      mutationFn: async () => {
         const { data } = await defaultTokenApiAxios.post<IRequestResponseMessage>('/logout');
         return data;
      },
      onError: (err: Error) => console.error(err.message),
      retry: 1
   })
};

export const useVerifyAuthStatus = (token: string | null) => {
   return useQuery<IVerifyAuthStatusResponse, Error>({
      queryKey: ['verifyUser', token],
      queryFn: async () => {
         const { data } = await defaultTokenApiAxios.get<IVerifyAuthStatusResponse>('/me');
         return data;
      },
      enabled: !!token,
      retry: 1
   })
};