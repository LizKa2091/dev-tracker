import { githubAxios } from "./github"
import type { IGithubRepository } from "./githubTypes"

export const getGithubRepositories = async (): Promise<IGithubRepository[]> => {
   const { data } = await githubAxios.get<IGithubRepository[]>('/user/repos');

   return data;
}