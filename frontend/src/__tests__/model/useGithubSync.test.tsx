import { describe, test, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useGithubSync } from '../../features/github/model/useGithubSync';
import * as GithubAPI from '../../shared/api/github/getGithubUser';
import * as GithubReposAPI from '../../shared/api/github/getGithubRepositories';
import * as GithubCommitsAPI from '../../shared/api/github/getGithubCommits';
import * as XpHook from '../../shared/note-item/model/useXpAction';
import * as NotifyHook from '../../shared/notifications/model/useCommitNotification';
import * as Storage from '../../features/github/model/githubStorage';
import AuthExports from '../../shared/context/AuthContext';
import type { IGithubStorageCommit } from '../../features/github/githubTypes';

vi.mock('../../shared/api/github/getGithubUser');
vi.mock('../../shared/api/github/getGithubRepositories');
vi.mock('../../shared/api/github/getGithubCommits');
vi.mock('../../shared/note-item/model/useXpAction');
vi.mock('../../shared/notifications/model/useCommitNotification');
vi.mock('../../features/github/model/githubStorage');
vi.mock('../../shared/context/AuthContext', async (importOriginal) => {
   const actual = await importOriginal<typeof import('../../shared/context/AuthContext')>();
   return {
      __esModule: true,
      default: {
         ...actual.default,
         useAuthContext: vi.fn(),
      },
   };
});

describe('useGithubSync tests', () => {
   const addXpMock = vi.fn().mockResolvedValue(undefined);
   const notifyCommitMock = vi.fn();

   beforeEach(() => {
      vi.clearAllMocks();

      (AuthExports.useAuthContext as any).mockReturnValue({ token: 'auth-token' });
      (XpHook.useXpAction as any).mockReturnValue({ addXp: addXpMock });
      (NotifyHook.useCommitNotifications as any).mockReturnValue({ notifyCommit: notifyCommitMock });
   });

   test('does nothing if githubToken is missing', () => {
      renderHook(() => useGithubSync(null));
      expect(GithubAPI.getGithubUser).not.toHaveBeenCalled();
      expect(GithubReposAPI.getGithubRepositories).not.toHaveBeenCalled();
   });

   test('syncs commits and calls addXp and notifyCommit for new commits', async () => {
      const githubToken = 'token';
      const username = 'user';
      const repos = [{ name: 'repo1' }];

      (GithubAPI.getGithubUser as any).mockResolvedValue({ login: username });
      (GithubReposAPI.getGithubRepositories as any).mockResolvedValue(repos);
      (GithubCommitsAPI.getGithubCommits as any).mockResolvedValue([
         { 
            sha: 'sha1', 
            commit: { 
            author: { name: 'Alice', email: 'alice@test.com', date: '2025-01-01' }, 
            message: 'msg1' 
            } 
         }
      ]);
      (Storage.githubGetRepCommits as any).mockReturnValue([]);
      (Storage.githubSaveCommits as any).mockImplementation(vi.fn());

      renderHook(() => useGithubSync(githubToken));

      await waitFor(() => {
         expect(GithubCommitsAPI.getGithubCommits).toHaveBeenCalledWith(username, 'repo1');
         expect(Storage.githubSaveCommits).toHaveBeenCalledWith('repo1', [
            { 
            sha: 'sha1', 
            author: { name: 'Alice', email: 'alice@test.com', date: '2025-01-01' }, 
            message: 'msg1' 
            }
         ]);
         expect(addXpMock).toHaveBeenCalled();
         expect(notifyCommitMock).toHaveBeenCalledWith('repo1', '2025-01-01');
      });
   });

   test('ignores commits if they are already saved', async () => {
      const githubToken = 'token';
      const username = 'user';
      const repos = [{ name: 'repo1' }];
      const prevCommits: IGithubStorageCommit[] = [
         { sha: 'sha1', author: { name: 'Alice', email: 'alice@test.com', date: '2025-01-01' }, message: 'msg1' }
      ];

      (GithubAPI.getGithubUser as any).mockResolvedValue({ login: username });
      (GithubReposAPI.getGithubRepositories as any).mockResolvedValue(repos);
      (GithubCommitsAPI.getGithubCommits as any).mockResolvedValue([
         { sha: 'sha1', commit: { author: { name: 'Alice', email: 'alice@test.com', date: '2025-01-01' }, message: 'msg1' } }
      ]);
      (Storage.githubGetRepCommits as any).mockReturnValue(prevCommits);
      (Storage.githubSaveCommits as any).mockImplementation(vi.fn());

      await renderHook(() => useGithubSync(githubToken));

      expect(Storage.githubSaveCommits).not.toHaveBeenCalled();
      expect(addXpMock).not.toHaveBeenCalled();
      expect(notifyCommitMock).not.toHaveBeenCalled();
   });
});
