import { useEffect } from "react";
import { useXpAction } from "../../../shared/note-item/model/useXpAction";
import type { IGithubStorageCommit } from "../githubTypes";
import { githubGetRepCommits, githubSaveCommits } from "../lib/githubStorage";
import { githubCommitsCompare } from "../lib/githubCommitsCompare";

export const useGithubCommitsWithXp = (token: string | null, repositoryTitle: string, commits: IGithubStorageCommit[]) => {
   const { addXp } = useXpAction(token);

   const handleNewCommit = async (commit: IGithubStorageCommit) => {
      try {
         await addXp();
         // snackbar success message
         console.log('начислен опыт за коммит', commit.message);
      }
      catch (err) {
         // snackbar error message
         console.error('произошла ошибка при начислении xp:', err);
      }
   }

   useEffect(() => {
      if (!token || !commits.length) return;

      const prevCommits = githubGetRepCommits(repositoryTitle);
      const newCommits = githubCommitsCompare(prevCommits, commits);

      if (newCommits.length > 0) {
         githubSaveCommits(repositoryTitle, commits);

         newCommits.forEach(handleNewCommit)
      }
   }, [token, commits, repositoryTitle])
}