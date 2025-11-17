import '@testing-library/jest-dom';

import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import DeadlineChart from '../../features/deadlines/ui/DeadlineChart';
import { demoTypeData } from '../../features/deadlines/demoDeadlineData';
import { getDeadlineChartData } from '../../features/deadlines/lib/getDeadlineChartData';

global.ResizeObserver = class {
   observe() {}
   unobserve() {}
   disconnect() {}
};

vi.mock('recharts', async () => {
   const actual = await vi.importActual('recharts');
   return {
      ...actual,
      ResponsiveContainer: ({ children }: any) => (
         <div style={{ width: 800, height: 400 }}>{children}</div>
      ),
   };
});

vi.mock('../../features/deadlines/ui/DeadlineChart/DeadlineChart.module.scss', () => ({
   default: { container: 'container' },
}));

vi.mock('../../features/deadlines/lib/getDeadlineChartData', () => ({
   getDeadlineChartData: vi.fn(),
}));

describe('DeadlineChart tests', () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   test('renders message if no data', async () => {
      (getDeadlineChartData as vi.Mock).mockReturnValue({
         chartData: null,
         types: [],
      });

      render(<DeadlineChart />);

      await waitFor(() => {
         expect(
         screen.getByText('У вас пока нет прошедших задач')
         ).toBeInTheDocument();
      });
   });

   test('renders demo mode', async () => {
      render(<DeadlineChart type='demo' />);

      expect(await screen.findByText('Прошедшие дедлайны за 14 дней по категориям')).toBeInTheDocument();

      await waitFor(() => {
         demoTypeData.forEach((type: any) => {
            expect(type).toBeTypeOf('string');
         });
      });
   });

   test('renders data from getDeadlineChartData', async () => {
      (getDeadlineChartData as vi.Mock).mockReturnValue({
         chartData: [
            { date: '2025-10-01', Work: 3, Study: 2 },
            { date: '2025-10-02', Work: 1, Study: 0 },
            ],
         types: ['Work', 'Study'],
      });

      render(<DeadlineChart />);

      await waitFor(() => {
         expect(screen.getByText('Прошедшие дедлайны за 14 дней по категориям')).toBeInTheDocument();
      });
   });

   test('calls getDeadlineChartData in default mode', async () => {
      render(<DeadlineChart />);

      await waitFor(() => {
         expect(getDeadlineChartData).toHaveBeenCalledTimes(1);
      });
   });
});
