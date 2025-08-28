export interface IGithubStorage {
   repositories: IGithubStorageRepCommits[];
}

export interface IGithubStorageRepCommits {
   repositoryTitle: string;
   commits: IGithubStorageCommit[];
}

export interface IGithubStorageCommit {
   sha: string;
   author: { name: string; email: string; date: string };
   message: string;
}