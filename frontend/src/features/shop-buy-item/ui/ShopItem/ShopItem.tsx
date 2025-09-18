import type { FC } from 'react';
import { Flex, Tooltip } from 'antd';
import { useBuyItem } from '../../model/useBuyItem';
import { usePurchaseNotification } from '../../model/usePurchaseNotification';
import styles from './ShopItem.module.scss';

interface IShopItemProps {
   id: string;
   name: string;
   cost: number;
   description: string;
   image: string;
   isAuthed: boolean | null;
};

const ShopItem: FC<IShopItemProps> = ({ id, name, cost, description, image, isAuthed }) => {
   const { mutateAsync: buyItem, isPending, isError } = useBuyItem();
   const { notifyPurchase } = usePurchaseNotification();

   const handleBuyItem = async () => {
      if (isPending || isError) return;

      if (!isAuthed) {
         notifyPurchase('Пожалуйста, авторизуйтесь для покупки', 'error');
         return;
      }

      try {
         const result = await buyItem({ itemId: id });
         notifyPurchase(result.message, 'success');
      }
      catch (err) {
         if (err instanceof Error) {
            notifyPurchase(err.message, 'error');
         }
         else {
            notifyPurchase('Не удалось совершить покупку', 'error');
         }
      }
   };

   return (
      <Flex className={styles.mainContainer}>
         <Tooltip title={description}>
            <Flex align='center' vertical gap='middle' onClick={handleBuyItem} className={`${styles.itemContainer} ${isError ? 'disabled' : ''}`}>
               <p>{name}</p>
               <img src={`${import.meta.env.VITE_API_BASE_URL}${image}`} alt={name} />
               <p className={styles.price}>{cost}</p>
            </Flex>
         </Tooltip>
      </Flex>
   )
}

export default ShopItem;