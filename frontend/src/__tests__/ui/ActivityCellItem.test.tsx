import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import dayjs from 'dayjs';

import ActivityCellItem from '../../features/activity-cells/ui/ActivityCellItem/ActivityCellItem';

vi.mock('../../features/activity-cells/lib/getActivityLevel', () => ({
   getActivityLevel: vi.fn((activities, _) => {
      return activities === 0 ? 0 : 1;
   })
}));

describe('ActivityCellItem tests', () => {
   const mockDay = '2025-10-13';

   test('renders hidden style when isHidden=true', () => {
      const { container } = render(
         <ActivityCellItem
            day={mockDay}
            isHidden={true}
            activities={3}
            maxActivities={10}
         />
      );

      const div = container.querySelector('div');
      expect(div?.className).toContain('hidden');
   });

   test('does not show tooltip text when hidden', () => {
      render(
         <ActivityCellItem
            day={mockDay}
            isHidden={true}
            activities={3}
            maxActivities={10}
         />
      );

      const tooltip = screen.queryByText(/выполненных заданий/);
      expect(tooltip).not.toBeInTheDocument();
   });

   test('applies correct level class based on getActivityLevel', () => {
      const { container } = render(
         <ActivityCellItem
            day={mockDay}
            isHidden={false}
            activities={5}
            maxActivities={10}
         />
      );

      const div = container.querySelector('div');
      expect(div?.className).toContain('level1');
   });
});
