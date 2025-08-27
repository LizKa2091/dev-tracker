import { githubAxios } from "./github";
import type { IGithubCommit } from "./githubTypes";

export const getGithubCommits = async (username: string, repTitle: string): Promise<IGithubCommit[]> => {
   const { data } = await githubAxios.get<IGithubCommit[]>(`/repos/${username}/${repTitle}/commits`);

   return data;
}