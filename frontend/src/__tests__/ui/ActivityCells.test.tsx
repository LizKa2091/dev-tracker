import '@testing-library/jest-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import { Grid } from 'antd';
import { useCellsData } from '../../features/activity-cells/model/useCellsData';
import { useCellsGrid } from '../../features/activity-cells/model/useCellsGrid';
import ActivityCellItem from '../../features/activity-cells/ui/ActivityCellItem/ActivityCellItem';
import ActivityCells from '../../features/activity-cells/ui/ActivityCells/ActivityCells';

vi.mock('antd', async (importOriginal) => {
   const antd = await importOriginal<typeof import('antd')>();
   return {
      ...antd,
      Grid: {
         ...antd.Grid,
         useBreakpoint: vi.fn()
      }
   };
});

vi.mock('../../features/activity-cells/model/useCellsData', () => ({
   useCellsData: vi.fn()
}));

vi.mock('../../features/activity-cells/model/useCellsGrid', () => ({
   useCellsGrid: vi.fn()
}));

vi.mock(
   '../../features/activity-cells/ui/ActivityCellItem/ActivityCellItem',
   () => ({
      default: vi.fn(({ day }) => <div data-testid="activity-cell">{day}</div>)
   })
);

describe('ActivityCells tests', () => {
   beforeEach(() => {
      vi.clearAllMocks();

      (useCellsData as vi.Mock).mockReturnValue({
         cellItems: [
            { day: '2025-10-10', activities: 3, isHidden: false },
            { day: '2025-10-11', activities: 2, isHidden: false }
         ]
      });

      (useCellsGrid as vi.Mock).mockReturnValue({
         weeks: [
            {
               days: [
                  { day: '2025-10-10', activities: 3, isHidden: false },
                  { day: '2025-10-11', activities: 2, isHidden: false },
                  null
               ]
            }
         ],
         maxActivities: 5
      });
   });

   test('renders year title and total activities', () => {
      (Grid.useBreakpoint as vi.Mock).mockReturnValue({ lg: true });

      render(<ActivityCells />);

      const year = dayjs().year();
      expect(screen.getByText(`За ${year} год`)).toBeInTheDocument();

      expect(screen.getByText('5 выполненных заданий')).toBeInTheDocument();
   });

   test('renders activity cells on desktop layout', () => {
      (Grid.useBreakpoint as vi.Mock).mockReturnValue({ lg: true });

      render(<ActivityCells />);

      const cells = screen.getAllByTestId('activity-cell');
      expect(cells).toHaveLength(2);
      expect(ActivityCellItem).toHaveBeenCalledTimes(2);
   });

   test('renders week day labels', () => {
      (Grid.useBreakpoint as vi.Mock).mockReturnValue({ lg: true });

      render(<ActivityCells />);

      const labels = screen.getAllByText(/пн|вт|ср|чт|пт|сб|вс/i);
      expect(labels.length).toBeGreaterThan(0);
   });
});
