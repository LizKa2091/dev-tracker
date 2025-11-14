import { describe, test, expect, vi } from 'vitest';
import { githubCommitsCompare } from '../../features/github/lib/githubCommitsCompare';
import type { IGithubStorageCommit } from '../../features/github/githubTypes';

vi.mock('../../shared/api/github/getGithubUser');
vi.mock('../../shared/api/github/getGithubRepositories');
vi.mock('../../shared/api/github/getGithubCommits');
vi.mock('../../shared/note-item/model/useXpAction');
vi.mock('../../shared/notifications/lib/useCommitNotification');
vi.mock('../../features/github/lib/githubStorage');
vi.mock('../../shared/context/AuthContext', () => ({
   useAuthContext: vi.fn(),
}));

describe('githubCommitsCompare tests', () => {
  test('returns new commits which are not in prevCommits', () => {
    const prevCommits: IGithubStorageCommit[] = [
      { sha: '1', author: { name: 'Alice', email: 'alice@test.com', date: '2025-01-01' }, message: 'a' },
      { sha: '2', author: { name: 'Bob', email: 'bob@test.com', date: '2025-01-02' }, message: 'b' },
    ];

    const updatedCommits: IGithubStorageCommit[] = [
      { sha: '2', author: { name: 'Bob', email: 'bob@test.com', date: '2025-01-02' }, message: 'b' },
      { sha: '3', author: { name: 'Charlie', email: 'charlie@test.com', date: '2025-01-03' }, message: 'c' },
    ];

    const result = githubCommitsCompare(prevCommits, updatedCommits);
    expect(result).toEqual([
      { sha: '3', author: { name: 'Charlie', email: 'charlie@test.com', date: '2025-01-03' }, message: 'c' }
    ]);
  });

  test('returns empty array if there are no new commits', () => {
    const prevCommits: IGithubStorageCommit[] = [
      { sha: '1', author: { name: 'Alice', email: 'alice@test.com', date: '2025-01-01' }, message: 'a' }
    ];
    const updatedCommits: IGithubStorageCommit[] = [
      { sha: '1', author: { name: 'Alice', email: 'alice@test.com', date: '2025-01-01' }, message: 'a' }
    ];

    const result = githubCommitsCompare(prevCommits, updatedCommits);
    expect(result).toEqual([]);
  });
});