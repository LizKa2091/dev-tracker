import { filterCommitsByDate } from '../../features/timeline/model/filterCommitsByDate';
import { githubLoadCommits } from '../../features/github/model/githubStorage';
import dayjs from 'dayjs';
import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('../../features/github/model/githubStorage');

describe('filterCommitsByDate tests', () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   test('returns empty array if unknown segment', () => {
      expect(filterCommitsByDate('unknown')).toEqual([]);
   });

   test('filter day commits', () => {
      const now = dayjs();
      const yesterday = now.subtract(1, 'day').subtract(1, 'hour');

      (githubLoadCommits as any).mockReturnValue({
         repositories: [
         {
            repositoryTitle: 'Repo1',
            commits: [
               { author: { date: now.toISOString() }},
               { author: { date: yesterday.toISOString() }}
            ]
         }
         ]
      });

      const result = filterCommitsByDate('day');

      expect(result[0].commits.length).toBe(1);
   });

   test('returns empty array if there are no repositories', () => {
      (githubLoadCommits as any).mockReturnValue({ repositories: [] });

      expect(filterCommitsByDate('day')).toEqual([]);
   });
});
