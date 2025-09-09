import type { FC } from 'react';
import { githubLoadCommits } from '../../../github/lib/githubStorage';
import GithubTimelineItem from '../GithubTimelineItem/GithubTimelineItem';

const GithubTimeline: FC = () => {
   const savedReps = githubLoadCommits().repositories;
      
   if (!savedReps.length) {
      return null;
   }

   return (
      savedReps.map(repository =>
         repository.commits.map(commit => 
            <GithubTimelineItem repName={repository.repositoryTitle} message={commit.message} date={commit.author.date} />
         )
      )
   )
}

export default GithubTimeline