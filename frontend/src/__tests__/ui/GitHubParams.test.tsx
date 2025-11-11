import '@testing-library/jest-dom';

import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import GitHubParams from '@/features/github-auth/ui/GitHubParams/GitHubParams';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = vi.fn();
const mockUseGithubSync = vi.fn();

let mockLocation = { search: '' };

vi.mock('react-router-dom', async () => {
   const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

   return {
      ...actual,
      useNavigate: () => mockNavigate,
      useLocation: () => mockLocation,
   };
});

vi.mock('@/features/github/model/useGithubSync', () => ({
   useGithubSync: (token: string | null) => mockUseGithubSync(token),
}));

describe('GitHubParams', () => {
   beforeEach(() => {
      vi.clearAllMocks();
      localStorage.clear();
      mockLocation = { search: '' };
   });

   test('renders message', () => {
      mockLocation.search = '?token=abc123';

      render(
         <MemoryRouter>
            <GitHubParams />
         </MemoryRouter>
      );

      expect(screen.getByText('Пожалуйста, подождите, идёт получение данных')).toBeInTheDocument();
   });

  test('if has token, saves to localStorage and redirects to /', async () => {
      mockLocation.search = '?token=myToken123';

      render(
         <MemoryRouter>
         <GitHubParams />
         </MemoryRouter>
      );

      expect(mockUseGithubSync).toHaveBeenCalledWith('myToken123');

      await waitFor(() => {
         expect(localStorage.getItem('githubToken')).toBe('myToken123');
         expect(mockNavigate).toHaveBeenCalledWith('/');
      });
   });

   test('if no token, redirect to /auth', async () => {
      mockLocation.search = '';

      render(
         <MemoryRouter>
         <GitHubParams />
         </MemoryRouter>
      );

      expect(mockUseGithubSync).toHaveBeenCalledWith(null);

      await waitFor(() => {
         expect(mockNavigate).toHaveBeenCalledWith('/auth');
      });
   });
});