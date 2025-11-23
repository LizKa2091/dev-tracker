import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import GitHubLoginButton from '../../../src/features/github-auth/ui/GitHubLoginButton/GitHubLoginButton';
import AuthExports from '../../../src/shared/context/AuthContext';

vi.mock('../../../src/shared/context/AuthContext', () => ({
   default: {
      useAuthContext: vi.fn()
   }
}));

vi.mock('../../../src/features/github-auth/ui/GitHubLoginButton/GitHubLoginButton.module.scss', () => ({
   default: { button: 'button' }
}));

describe('GitHubLoginButton tests', () => {
   const mockUseAuth = AuthExports.useAuthContext as unknown as vi.Mock;

   beforeEach(() => {
      vi.resetAllMocks();
      localStorage.clear();
   });

   test('does not display if there is githubToken in localStorage', () => {
      localStorage.setItem('githubToken', '123');
      mockUseAuth.mockReturnValue({ token: 'abc' });

      render(<GitHubLoginButton />);

      expect(screen.queryByText('Связать с GitHub')).toBeNull();
   });

   test('does not display if there is no token in AuthContext', () => {
      mockUseAuth.mockReturnValue({ token: null });

      render(<GitHubLoginButton />);

      expect(screen.queryByText('Связать сGitHub')).toBeNull();
   });

   test('displays if there is token and githubToken does not exist', () => {
      mockUseAuth.mockReturnValue({ token: 'user-token' });

      render(<GitHubLoginButton />);

      expect(screen.getByText('Связать с GitHub')).toBeInTheDocument();
   });
});
