import type { AxiosResponse } from 'axios';
import axios, { isAxiosError } from 'axios';

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5001';
const safeErrMessage = 'Ошибка на сервере';

const defaultTokenApiAxios = axios.create({
   baseURL: baseUrl
});

export const apiAxios = axios.create({
   baseURL: baseUrl
});

const avatarAxios = axios.create({
   baseURL: baseUrl
})

defaultTokenApiAxios.interceptors.request.use(
   (config) => {
      const token = localStorage.getItem('token');

      if (token) {
         config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
      }
      
      return config;
   }
);

defaultTokenApiAxios.interceptors.response.use(
   (res: AxiosResponse) => {
      if (res.data?.token) localStorage.setItem('token', res.data.token);

      return res;
   },
   (err) => {
      if (isAxiosError(err)) {
         throw new Error(err.response?.data.message || safeErrMessage);
      }
      else if (err instanceof Error) {
         throw new Error(err.message || safeErrMessage);
      }

      throw new Error(safeErrMessage);
   }
);

apiAxios.interceptors.response.use(
   (res: AxiosResponse) => res,
   (err) => {
      if (isAxiosError(err)) {
         throw new Error(err.response?.data.message || safeErrMessage);
      }
      else if (err instanceof Error) {
         throw new Error(err.message || safeErrMessage);
      }

      throw new Error(safeErrMessage);
   }
);

avatarAxios.interceptors.request.use(
   (config) => {
      const token = localStorage.getItem('token');

      if (token) {
         config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
      }
      
      const configData = config.data as { file?: File };

      if (configData?.file instanceof File) {
         const formData = new FormData();
         formData.append('avatar', configData.file);
         config.data = formData;
      }

      return config;
   }
);

avatarAxios.interceptors.response.use(
   (res: AxiosResponse) => res,
   (err) => {
      if (isAxiosError(err)) {
         throw new Error(err.response?.data.message || safeErrMessage);
      }
      else if (err instanceof Error) {
         throw new Error(err.message || safeErrMessage);
      }

      throw new Error(safeErrMessage);
   }
);

export { defaultTokenApiAxios, avatarAxios };