import { githubAxios } from "./github"
import type { IGithubUser } from "./githubTypes";

export const getGithubUser = async (): Promise<IGithubUser> => {
   const { data } = await githubAxios.get<IGithubUser>('/user');

   return data;
};