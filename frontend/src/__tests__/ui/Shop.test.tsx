import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import Shop from '../../features/shop-buy-item/ui/Shop/Shop'
import AuthExports from '../../shared/context/AuthContext';
import { useShopItems } from '../../features/shop-buy-item/model/useShopItems';

vi.mock('../../shared/context/AuthContext', () => ({
   default: {
      useAuthContext: vi.fn(),
   },
}));

vi.mock('../../features/shop-buy-item/model/useShopItems', () => ({
   useShopItems: vi.fn(),
}));
vi.mock('../../features/shop-buy-item/ui/ShopItem/ShopItem', () => ({
   default: vi.fn(() => <div data-testid="shop-item" />),
}));

describe('Shop tests', () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   test('renders all ShopItem', () => {
      (useShopItems as any).mockReturnValue({
         data: { shopItems: [{ id: '1' }, { id: '2' }] },
      });
      (AuthExports.useAuthContext as any).mockReturnValue({ isAuthed: true });

      render(<Shop />);

      expect(screen.getAllByTestId('shop-item')).toHaveLength(2);
   });
});
