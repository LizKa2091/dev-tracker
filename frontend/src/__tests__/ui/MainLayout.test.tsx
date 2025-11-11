import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';

import MainLayout from '@/app/MainLayout';

vi.mock('@/widgets/Sidebar/ui/Sidebar', () => ({
   default: () => <div data-testid="sidebar">sidebar</div>
}));

vi.mock('@/widgets/FooterBar/ui/FooterBar', () => ({
   default: () => <div data-testid="footerbar">footerbar</div>
}));

vi.mock('@/shared/notifications/ui/Notifications/Notifications', () => ({
   default: () => <div data-testid="notifications">notifications</div>
}));

describe('MainLayout tests', () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   test('renders without errors', () => {
      render(
         <MainLayout>
            <div data-testid="child">Main content</div>
         </MainLayout>
      );

      const layout = document.querySelector('.mainLayout');

      expect(layout).toBeInTheDocument();
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('footerbar')).toBeInTheDocument();
      expect(screen.getByTestId('notifications')).toBeInTheDocument();

      const content = document.querySelector('.content');
      expect(content).toBeInTheDocument();
      expect(screen.getByTestId('child')).toBeInTheDocument();
   });

   test('renders childrens', () => {
      render(
         <MainLayout>
            <p>child</p>
         </MainLayout>
      );

      expect(screen.getByText('child')).toBeInTheDocument();
   });
});
