import type { IGithubStorageCommit } from "../githubTypes";

export const githubCommitsCompare = (prevCommits: IGithubStorageCommit[], updatedCommits: IGithubStorageCommit[]) => {
   const prevShaSet = new Set(prevCommits.map((commit => commit.sha)));

   return updatedCommits.filter(commit => !prevShaSet.has(commit.sha));
};