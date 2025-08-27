import type { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import axios from "axios";
import { isAxiosError } from "axios";

const baseUrl = 'https://api.github.com';
const safeErrMessage = 'Ошибка на сервере';

const githubAxios = axios.create({
   baseURL: baseUrl
});

githubAxios.interceptors.request.use(
   (config) => {
      const token = localStorage.getItem('githubToken');

      if (token) {
         config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
      }

      return config;
   }
);

githubAxios.interceptors.response.use(
   (res: AxiosResponse) => res,
   (err) => {
      if (isAxiosError(err)) {
         const axiosErr = err as AxiosError;
         throw new Error(axiosErr)
      }
      if (err instanceof Error) {
         throw new Error(err.message || safeErrMessage);
      }
      throw new Error(safeErrMessage);
   }
)

export { githubAxios };