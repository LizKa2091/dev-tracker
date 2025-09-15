import type { FC } from 'react';
import { Flex } from 'antd';
import ShopItem from '../ShopItem/ShopItem';
import { useShopItems } from '../../model/useShopItems';

const Shop: FC = () => {
   const { data: shopItems } = useShopItems();
   
   return (
      <Flex>
         {shopItems?.shopItems.map(item =>
            <ShopItem key={item.id} {...item} />
         )}
      </Flex>
   )
}

export default Shop;