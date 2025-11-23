import type { IGithubStorageRepCommits } from "../../github/githubTypes";
import { githubLoadCommits } from "../../github/model/githubStorage";
import dayjs from 'dayjs';

dayjs().format()

export const filterCommitsByDate = (segment: string): IGithubStorageRepCommits[] => {
   let destinDay: dayjs.Dayjs;

   switch (segment) {
      case 'day':
         destinDay = dayjs().subtract(1, 'day');
         break;
      case 'week':
         destinDay = dayjs().subtract(7, 'day');
         break;
      case 'month':
         destinDay = dayjs().subtract(30, 'day');
         break;
      case 'year':
         destinDay = dayjs().subtract(365, 'day');
         break;
      default:
         return [];
   }

   const savedReps: IGithubStorageRepCommits[] = githubLoadCommits().repositories;
   if (!savedReps || !savedReps.length) return [];

   const filteredReps: IGithubStorageRepCommits[] = savedReps.map(rep => ({
      repositoryTitle: rep.repositoryTitle,
      commits: rep.commits.filter(commit => dayjs(commit.author.date).isAfter(destinDay))
   }));
   
   return filteredReps;
};