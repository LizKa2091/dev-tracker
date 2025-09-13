import type { FC } from 'react';
import { Flex, Tooltip } from 'antd';
import { useBuyItem } from '../../model/useBuyItem';
import { usePurchaseNotification } from '../../model/usePurchaseNotification';
import styles from './ShopItem.module.scss';

interface IShopItemProps {
   id: string,
   name: string,
   cost: number,
   description: string,
   image: string,
   effect: any,
};

const ShopItem: FC<IShopItemProps> = ({ id, name, cost, description, image, effect }) => {
   const { mutateAsync: buyItem, isPending } = useBuyItem();
   const { notifyPurchase } = usePurchaseNotification();

   const handleBuyItem = async () => {
      if (isPending) return;

      try {
         const result = await buyItem({ itemId: id });
         notifyPurchase('Успешная покупка', result.message);
      }
      catch (err) {
         if (err instanceof Error) {
            notifyPurchase('Ошибка', err.message);
         }
         else {
            notifyPurchase('Ошибка', 'Не удалось совершить покупку');
         }
      }
   };

   return (
      <Flex className={styles.mainContainer}>
         <Tooltip title={description}>
            <Flex align='center' vertical gap='middle' onClick={handleBuyItem} className={styles.itemContainer}>
               <p>{name}</p>
               <img src={`${import.meta.env.VITE_API_BASE_URL}${image}`} alt={name} />
               <p className={styles.price}>{cost}</p>
            </Flex>
         </Tooltip>
      </Flex>
   )
}

export default ShopItem;