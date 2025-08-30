export interface IGithubUser {
   login: string;
   id: string;
   avatar_url: string;
}

export interface IGithubRepository {
   id: number;
   name: string;
   full_name: string;
   private: boolean;
}

export interface IGithubCommit {
   sha: string;
   commit: {
      author: { name: string; email: string; date: string };
      message: string;
   }
}