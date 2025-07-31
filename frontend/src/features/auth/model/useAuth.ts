import { useMutation, useQuery } from '@tanstack/react-query';

const backendBaseUrl = 'http://localhost:5001';

interface IRequestResponseMessage {
   message: string;
};

interface ILoginRequestResponse {
   token: string;
};

interface IVerifyAuthStatusResponse {
   email: string;
   name: string;
}

const registerUser = async (email: string, password: string, name: string): Promise<IRequestResponseMessage> => {
   const response = await fetch(`${backendBaseUrl}/register`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, password, name})
   });

   if (!response.ok) throw new Error('ошибка сервера или пользователь уже существует');

   const result = await response.json();
   return result;
};

export const useRegisterUser = () => {
   return useMutation<IRequestResponseMessage, Error, {email: string, password: string, name: string}>({
      mutationKey: ['register'],
      mutationFn: async ({ email, password, name }) => registerUser(email, password, name),
      retry: 1
   })
};

const loginUser = async (email: string, password: string): Promise<ILoginRequestResponse> => {
   const response = await fetch(`${backendBaseUrl}/login`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, password})
   });

   if (response.status === 401) throw new Error('Неверный email или пароль')
   if (!response.ok) throw new Error('ошибка сервера');

   const result = await response.json();
   return result;
};

export const useLoginUser = () => {
   return useMutation<ILoginRequestResponse, Error, {email: string, password: string}>({
      mutationKey: ['login'],
      mutationFn: async ({email, password}) => loginUser(email, password),
      retry: 1
   })
};

const logoutUser = async (token: string): Promise<IRequestResponseMessage> => {
   const response = await fetch(`${backendBaseUrl}/logout`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         'authorization': `Bearer ${token}`
      }
   });

   if (!response.ok) throw new Error('ошибка сервера');

   const result = await response.json();
   return result;
};

export const useLogoutUser = () => {
   return useMutation<IRequestResponseMessage, Error, {token: string}>({
      mutationKey: ['logout'],
      mutationFn: async ({token}) => logoutUser(token),
      retry: 1
   })
};

const verifyAuthStatus = async (token: string) => {
   const response = await fetch(`${backendBaseUrl}/me`, {
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

export const useVerifyAuthStatus = (token: string | null) => {
   return useQuery<IVerifyAuthStatusResponse, Error>({
      queryKey: ['verifyUser', token],
      queryFn: () => {
         if (!token) throw new Error('не предоставлен токен для проверки авторизации пользователя');

         return verifyAuthStatus(token)
      },
      enabled: !!token,
      retry: 1
   })
};