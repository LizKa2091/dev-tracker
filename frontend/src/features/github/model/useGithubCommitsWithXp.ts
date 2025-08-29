import { useEffect } from "react";
import { useXpAction } from "../../../shared/note-item/model/useXpAction";
import type { IGithubStorageCommit } from "../githubTypes";
import { githubGetRepCommits, githubSaveCommits } from "../lib/githubStorage";
import { githubCommitsCompare } from "../lib/githubCommitsCompare";
import { useCommitNotifications } from "../../../shared/notifications/lib/useCommitNotification";

export const useGithubCommitsWithXp = (token: string | null, repositoryTitle: string, commits: IGithubStorageCommit[]) => {
   const { addXp } = useXpAction(token);
   const { notifyCommit } = useCommitNotifications();

   useEffect(() => {
      if (!token || !commits.length) return;

      const prevCommits = githubGetRepCommits(repositoryTitle);
      const newCommits = githubCommitsCompare(prevCommits, commits);

      if (newCommits.length > 0) {
         githubSaveCommits(repositoryTitle, commits);

         newCommits.forEach(async (commit) => {
            try {
               await addXp();
               notifyCommit(repositoryTitle, commit.message);
            }
            catch (err) {
               console.error('произошла ошибка при начислении опыта за коммит', err);
            }
         })
      }
   }, [token, commits, repositoryTitle, addXp, notifyCommit])
}