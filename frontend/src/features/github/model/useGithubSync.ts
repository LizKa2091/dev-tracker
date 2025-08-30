import { useEffect } from "react";
import AuthExports from "../../../shared/context/AuthContext"
import { getGithubUser } from "../../../shared/api/github/getGithubUser";
import { getGithubRepositories } from "../../../shared/api/github/getGithubRepositories";
import { getGithubCommits } from "../../../shared/api/github/getGithubCommits";
import type { IGithubStorageCommit } from "../githubTypes";
import { useXpAction } from "../../../shared/note-item/model/useXpAction";
import { useCommitNotifications } from "../../../shared/notifications/lib/useCommitNotification";
import { githubGetRepCommits, githubSaveCommits } from "../lib/githubStorage";
import { githubCommitsCompare } from "../lib/githubCommitsCompare";

export const useGithubSync = () => {
   const { token } = AuthExports.useAuthContext();
   const githubToken = localStorage.getItem('githubToken');

   const { addXp } = useXpAction(token);
   const { notifyCommit } = useCommitNotifications();

   useEffect(() => {
      if (!githubToken || !token) return;

      const syncUserCommits = async () => {
         try {
            const { login: username } = await getGithubUser();
            const userRepositories = await getGithubRepositories();

            for (const rep of userRepositories) {
               const commitsResponse = await getGithubCommits(username, rep.name);

               const commits: IGithubStorageCommit[] = commitsResponse.map(item => ({
                  sha: item.sha,
                  author: item.commit.author,
                  message: item.commit.message
               }));

               if (!commits.length) continue;

               const prevCommits = githubGetRepCommits(rep.name);
               const newCommits = githubCommitsCompare(prevCommits, commits);

               if (newCommits.length > 0) {
                  githubSaveCommits(rep.name, commits);

                  for (const commit of newCommits) {
                     try {
                        await addXp();
                        notifyCommit(rep.name, commit.message);
                     }
                     catch (err) {
                        console.error('произошла ошибка при начислении опыта за коммит', err)
                     }
                  }
               }
            }
         }
         catch (err) {
            console.error('произошла ошибка при синхронизации коммитов', err);
         }
      }

      syncUserCommits();
   }, [token, githubToken, addXp, notifyCommit])
}