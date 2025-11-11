import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TagsSettings from '../../features/settings/ui/Tags/TagSettings/TagsSettings';

import { loadUserTags, deleteUserTag } from '../../features/settings/model/tagActions';

vi.mock('../../features/settings/model/tagActions', () => ({
   loadUserTags: vi.fn(),
   deleteUserTag: vi.fn(),
}));

vi.mock('../../features/settings/ui/Tags/AddCustomTag/AddCustomTag', () => ({
   default: ({ isModalOpen }: { isModalOpen: boolean }) =>
      isModalOpen ? <div data-testid="modal">Modal</div> : null
}));

const mockTags = [
   { key: '1', label: 'Work', color: 'red' },
   { key: '2', label: 'Home', color: 'blue' },
];

describe('TagsSettings tests', () => {

   beforeEach(() => {
      vi.clearAllMocks();
      (loadUserTags as vi.Mock).mockReturnValue(mockTags);
   });

   test('renders and displays saved tags', () => {
      render(<TagsSettings />);

      expect(loadUserTags).toHaveBeenCalled();

      expect(screen.getByText('Work')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
   });

   test('calls deleteUserTag on tag deletion', () => {
      render(<TagsSettings />);

      const closeIcons = screen.getAllByLabelText(/close/i);

      fireEvent.click(closeIcons[0]);

      expect(deleteUserTag).toHaveBeenCalledWith('Work');
   });

   test('opens modal on button clcik', () => {
      render(<TagsSettings />);

      const button = screen.getByRole('button', { name: 'Добавить новый тэг' });
      fireEvent.click(button);

      expect(screen.getByTestId('modal')).toBeInTheDocument();
   });
});
