import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import ShopItem from '../../features/shop-buy-item/ui/ShopItem/ShopItem';
import { useBuyItem } from '../../features/shop-buy-item/model/useBuyItem';
import { usePurchaseNotification } from '../../features/shop-buy-item/model/usePurchaseNotification';

vi.mock('../../features/shop-buy-item/model/useBuyItem');
vi.mock('../../features/shop-buy-item/model/usePurchaseNotification');

describe('ShopItem tests', () => {
   const buyMock = vi.fn();
   const notifyMock = vi.fn();

   beforeEach(() => {
      vi.clearAllMocks();
      (useBuyItem as any).mockReturnValue({ mutateAsync: buyMock, isPending: false, isError: false });
      (usePurchaseNotification as any).mockReturnValue({ notifyPurchase: notifyMock });
   });

   test('displays notification if not authed', async () => {
      render(<ShopItem id="1" name="Item" cost={10} description="desc" image="/img.png" isAuthed={false} />);
      
      fireEvent.click(screen.getByText('Item'));
      
      expect(notifyMock).toHaveBeenCalledWith('Пожалуйста, авторизуйтесь для покупки', 'error');
   });

   test('success purchase if authed', async () => {
      buyMock.mockResolvedValue({ message: 'Успешно куплено' });

      render(<ShopItem id="1" name="Item" cost={10} description="desc" image="/img.png" isAuthed={true} />);
      
      fireEvent.click(screen.getByText('Item'));
      
      await new Promise(process.nextTick);
      expect(notifyMock).toHaveBeenCalledWith('Успешно куплено', 'success');
   });

   test('failed purchase', async () => {
      buyMock.mockRejectedValue(new Error('Ошибка'));

      render(<ShopItem id="1" name="Item" cost={10} description="desc" image="/img.png" isAuthed={true} />);
      
      fireEvent.click(screen.getByText('Item'));
      
      await new Promise(process.nextTick);
      expect(notifyMock).toHaveBeenCalledWith('Ошибка', 'error');
   });
});
