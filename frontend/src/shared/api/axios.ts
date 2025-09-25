import type { AxiosError } from 'axios';
import type { AxiosRequestHeaders } from 'axios';
import type { AxiosResponse } from 'axios';
import axios, { isAxiosError } from 'axios';

interface IRefreshResponse {
   token: string;
}

interface IAxiosErrorResponse {
   message: string;
}

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5001';
const safeErrMessage = 'Ошибка на сервере';

const defaultTokenApiAxios = axios.create({
   baseURL: baseUrl
});

const apiAxios = axios.create({
   baseURL: baseUrl,
   withCredentials: true
});

const avatarAxios = axios.create({
   baseURL: baseUrl
});

const shopItemsAxios = axios.create({
   baseURL: baseUrl
});

const handleAxiosError = (err: unknown): never => {
   if (isAxiosError(err)) {
      const axiosErr = err as AxiosError<IAxiosErrorResponse>;
      throw new Error(axiosErr.response?.data.message || safeErrMessage);
   }
   if (err instanceof Error) {
      throw new Error(err.message || safeErrMessage);
   }

   throw new Error(safeErrMessage);
};

defaultTokenApiAxios.interceptors.request.use((config) => {
   const token = localStorage.getItem('token');

   if (token) {
      config.headers = config.headers ?? {};

      const headers = config.headers as AxiosRequestHeaders;

      if (typeof headers.set === 'function') {
         headers.set('Authorization', `Bearer ${token}`);
      } else {
         headers['Authorization'] = `Bearer ${token}`;
      }
   }

   return config;
});

defaultTokenApiAxios.interceptors.response.use(
   (res: AxiosResponse) => {
      if (res.data?.token) localStorage.setItem('token', res.data.token);

      return res;
   },
   async (err) => {
      if (err.response?.status === 401 && !err.config._retry) {
         err.config._retry = true;

         try {
            const { data } = await apiAxios.post<IRefreshResponse>('/refresh');
            localStorage.setItem('token', data.token);

            err.config.headers = {
               ...err.config.headers,
               Authorization: `Bearer ${data.token}`
            };
            return defaultTokenApiAxios(err.config);
         } catch (error) {
            localStorage.removeItem('token');

            handleAxiosError(error);
         }
      }
      handleAxiosError(err);
   }
);

apiAxios.interceptors.response.use(
   (res: AxiosResponse) => res,
   (err) => handleAxiosError(err)
);

avatarAxios.interceptors.request.use((config) => {
   const token = localStorage.getItem('token');

   if (token) {
      config.headers = config.headers ?? {};

      const headers = config.headers as AxiosRequestHeaders;

      if (typeof headers.set === 'function') {
         headers.set('Authorization', `Bearer ${token}`);
      } else {
         headers['Authorization'] = `Bearer ${token}`;
      }
   }

   const configData = config.data as { file?: File };

   if (configData?.file instanceof File) {
      const formData = new FormData();
      formData.append('avatar', configData.file);
      config.data = formData;
   }

   return config;
});

avatarAxios.interceptors.response.use(
   (res: AxiosResponse) => res,
   (err) => handleAxiosError(err)
);

shopItemsAxios.interceptors.response.use(
   (res: AxiosResponse) => res,
   (err) => handleAxiosError(err)
);

export { defaultTokenApiAxios, apiAxios, avatarAxios, shopItemsAxios };
