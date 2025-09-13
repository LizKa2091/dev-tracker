import type { FC } from 'react';
import { Flex, Tooltip } from 'antd';
import { useBuyItem } from '../../model/useBuyItem';
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
   const { mutate: buyItem, isPending } = useBuyItem();

   const handleBuyItem = async () => {
      if (isPending) return;

      buyItem({ itemId: id });
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