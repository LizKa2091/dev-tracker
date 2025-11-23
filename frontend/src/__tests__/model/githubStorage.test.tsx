import { describe, test, expect, beforeEach } from 'vitest';
import { githubLoadCommits, githubSaveCommits, githubGetRepCommits } from '../../features/github/model/githubStorage'; 
import { type IGithubStorageCommit } from '../../features/github/githubTypes';

describe('githubStorage tests', () => {
   beforeEach(() => {
      localStorage.clear();
      });

   test('githubLoadCommits returns empty structure if there is no data', () => {
      const result = githubLoadCommits();
      expect(result).toEqual({ repositories: [] });
   });

   test('githubSaveCommits adds new repo if there is no any', () => {
      const commits: IGithubStorageCommit[] = [
         { sha: '1', message: 'init', date: '2024' }
      ];

      githubSaveCommits('my-repo', commits);

      const saved = JSON.parse(localStorage.getItem('githubCommits')!);

      expect(saved.repositories).toHaveLength(1);
      expect(saved.repositories[0]).toEqual({
         repositoryTitle: 'my-repo',
         commits
      });
   });

   test('githubSaveCommits updated existing repo', () => {
      const oldCommits: IGithubStorageCommit[] = [
         { sha: '1', message: 'old', date: '2024' }
      ];
      const newCommits: IGithubStorageCommit[] = [
         { sha: '2', message: 'new', date: '2025' }
      ];

      githubSaveCommits('repo', oldCommits);
      githubSaveCommits('repo', newCommits);

      const saved = JSON.parse(localStorage.getItem('githubCommits')!);

      expect(saved.repositories).toHaveLength(1);
      expect(saved.repositories[0].commits).toEqual(newCommits);
   });

   test('githubSaveCommits sets limit to 50 repos', () => {
      for (let i = 1; i <= 50; i++) {
         githubSaveCommits(`repo${i}`, []);
      }

      githubSaveCommits('newRepo', []);

      const saved = JSON.parse(localStorage.getItem('githubCommits')!);

      expect(saved.repositories).toHaveLength(50);
      expect(saved.repositories[0].repositoryTitle).toBe('repo2');
      expect(saved.repositories[49].repositoryTitle).toBe('newRepo');
   });

   test('githubGetRepCommits returns repo commits', () => {
      const commits: IGithubStorageCommit[] = [
         { sha: '1', message: 'msg', date: '2024' }
      ];

      githubSaveCommits('test-repo', commits);

      const result = githubGetRepCommits('test-repo');

      expect(result).toEqual(commits);
   });

   test('githubGetRepCommits returns empty array if repo was not found', () => {
      const result = githubGetRepCommits('missing');
      expect(result).toEqual([]);
   });
});
