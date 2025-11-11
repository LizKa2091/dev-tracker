import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import GithubTimeline from '../../features/timeline/ui/GithubTimeline/GithubTimeline';

vi.mock('antd', async () => {
   const actual = await vi.importActual<typeof import('antd')>('antd');
   
   return {
      ...actual,
      Flex: ({ children }: any) => <div>{children}</div>,
      Card: ({ title, extra, children }: any) => (
         <div data-testid="card">
         <div>{title}</div>
         <div>{extra}</div>
         <div>{children}</div>
         </div>
      ),
   };
});

vi.mock('@ant-design/icons', () => ({
   GithubOutlined: () => <svg data-testid="github-icon" />,
}));

const mockFilterCommitsByDate = vi.fn();
vi.mock('../../features/timeline/model/filterCommitsByDate', () => ({
   filterCommitsByDate: (segment: string) => mockFilterCommitsByDate(segment),
}));

describe('GithubTimeline tests', () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   test('render nothing if no commits', () => {
      mockFilterCommitsByDate.mockReturnValue([]);
      const { container } = render(<GithubTimeline segment="week" />);
      expect(container.firstChild).toBeNull();
   });

   test('рендерит карточки для каждого коммита', () => {
      mockFilterCommitsByDate.mockReturnValue([
         {
         repositoryTitle: 'awesome-repo',
         commits: [
            {
               message: 'Fix login bug',
               author: { date: '2025-11-05T12:00:00Z' },
            },
            {
               message: 'Add tests for auth flow',
               author: { date: '2025-11-06T14:30:00Z' },
            },
         ],
         },
         {
         repositoryTitle: 'second-repo',
         commits: [
            {
               message: 'Initial commit',
               author: { date: '2025-10-31T08:00:00Z' },
            },
         ],
         },
      ]);

      render(<GithubTimeline segment="month" />);

      expect(screen.getAllByTestId('card')).toHaveLength(3);

      expect(screen.getAllByText('Коммит в репозитории: awesome-repo')).toHaveLength(2);
      expect(screen.getAllByText('Коммит в репозитории: second-repo')).toHaveLength(1);
      expect(screen.getByText('Fix login bug')).toBeInTheDocument();
      expect(screen.getByText('Add tests for auth flow')).toBeInTheDocument();
      expect(screen.getByText('Initial commit')).toBeInTheDocument();

      expect(screen.getByText('2025-11-05')).toBeInTheDocument();
      expect(screen.getByText('2025-11-06')).toBeInTheDocument();
      expect(screen.getByText('2025-10-31')).toBeInTheDocument();

      expect(screen.getAllByTestId('github-icon').length).toBeGreaterThan(0);
   });

   test('gives valid arguments to filterCommitsByDate', () => {
      mockFilterCommitsByDate.mockReturnValue([]);
      render(<GithubTimeline segment="year" />);
      expect(mockFilterCommitsByDate).toHaveBeenCalledWith('year');
   });
});
