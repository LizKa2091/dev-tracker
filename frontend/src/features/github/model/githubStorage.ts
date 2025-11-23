import type { IGithubStorage, IGithubStorageCommit } from "../githubTypes";
const maxRepositories = 50;

export const githubLoadCommits = (): IGithubStorage => {
   const savedData = localStorage.getItem('githubCommits');

   return savedData ? JSON.parse(savedData) : { repositories: [] };
};

export const githubSaveCommits = (repositoryTitle: string, commits: IGithubStorageCommit[]) => {
   const savedData = githubLoadCommits();
   
   const existingRepIndex = savedData.repositories.findIndex(rep => rep.repositoryTitle === repositoryTitle);
   if (existingRepIndex === -1) {
      if (savedData.repositories.length >= maxRepositories) {
         savedData.repositories.shift();
      }
      
      savedData.repositories.push({ repositoryTitle, commits });
   }
   else {
      savedData.repositories[existingRepIndex].commits = commits;
   }
   
   localStorage.setItem('githubCommits', JSON.stringify(savedData));
};

export const githubGetRepCommits = (repositoryTitle: string): IGithubStorageCommit[] => {
   const savedData = githubLoadCommits();
   const repository = savedData.repositories.find((rep => rep.repositoryTitle === repositoryTitle));

   return repository ? repository.commits : [];
}