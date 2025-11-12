import { useCellsData } from './../../features/activity-cells/model/useCellsData';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import dayjs from 'dayjs';

vi.mock('../../features/user/model/useUserData', () => ({
   useUserData: vi.fn(),
}));

vi.mock('../../features/github/lib/githubStorage', () => ({
   githubLoadCommits: vi.fn(),
}));

vi.mock('../../shared/context/AuthContext', () => ({
   default: {
      useAuthContext: vi.fn(),
   },
}));

import { useUserData } from '../../features/user/model/useUserData';
import { githubLoadCommits } from '../../features/github/lib/githubStorage';
import AuthExports from '../../shared/context/AuthContext';

describe('useCellsData tests', () => {
   beforeEach(() => {
      vi.clearAllMocks();
      localStorage.clear();
   });

   test('returns empty data if userData not loaded', () => {
      (AuthExports.useAuthContext as any).mockReturnValue({ token: 'test-token' });
      (useUserData as any).mockReturnValue({ data: null, isLoading: true });

      const { result } = renderHook(() => useCellsData());

      expect(result.current).toEqual({ totalCells: 0, years: [], cellItems: [] });
   });

   test('depends on activity data from commits and notes', async () => {
      const registrationDate = dayjs().subtract(6, 'months').toISOString();

      (AuthExports.useAuthContext as any).mockReturnValue({ token: 'mock-token' });

      (useUserData as any).mockReturnValue({
         data: { registrationDate },
         isLoading: false,
      });

      (githubLoadCommits as any).mockReturnValue({
         repositories: [
            {
               commits: [
                  { author: { date: dayjs().subtract(2, 'days').toISOString() } },
                  { author: { date: dayjs().subtract(2, 'days').toISOString() } },
               ],
            },
         ],
      });

      const notes = {
         notes: [
            {
               id: '1',
               status: 'completed',
               completedDate: dayjs().subtract(1, 'day').toISOString(),
            },
            {
               id: '2',
               status: 'pending',
            },
         ],
      };
      localStorage.setItem('notes', JSON.stringify(notes));

      const { result } = renderHook(() => useCellsData());

      await waitFor(() => {
         expect(result.current.totalCells).toBeGreaterThan(300);
         expect(result.current.cellItems.length).toBe(result.current.totalCells);

         const commitDay = dayjs().subtract(2, 'days').startOf('day').toDate().toISOString();
         const noteDay = dayjs().subtract(1, 'day').startOf('day').toDate().toISOString();

         const commitCell = result.current.cellItems.find(c => c.day === commitDay);
         const noteCell = result.current.cellItems.find(c => c.day === noteDay);

         expect(commitCell?.activities).toBeGreaterThanOrEqual(2);
         expect(noteCell?.activities).toBeGreaterThanOrEqual(1);
      });
   });

   test('ignores commits and notes until registratiom date', async () => {
      const registrationDate = dayjs().toISOString();

      (AuthExports.useAuthContext as any).mockReturnValue({ token: 'mock-token' });
      (useUserData as any).mockReturnValue({
         data: { registrationDate },
         isLoading: false,
      });

      (githubLoadCommits as any).mockReturnValue({
         repositories: [
         {
            commits: [
               { author: { date: dayjs().subtract(100, 'days').toISOString() } },
            ],
         },
         ],
      });

      const notes = {
         notes: [
         {
            id: '1',
            status: 'completed',
            completedDate: dayjs().subtract(200, 'days').toISOString(),
         },
         ],
      };
      localStorage.setItem('notes', JSON.stringify(notes));

      const { result } = renderHook(() => useCellsData());

      await waitFor(() => {
         expect(result.current.cellItems.every(c => c.activities === 0)).toBe(true);
      });
   });
});
