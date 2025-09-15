import type { FC } from 'react';
import { Flex } from 'antd';
import { useShopItems } from '../../model/useShopItems';
import ShopItem from '../ShopItem/ShopItem';
import AuthExports from '../../../../shared/context/AuthContext';

const Shop: FC = () => {
   const { data: shopItems } = useShopItems();
   const { isAuthed } = AuthExports.useAuthContext();
   
   return (
      <Flex>
         {shopItems?.shopItems.map(item =>
            <ShopItem key={item.id} {...item} isAuthed={isAuthed} />
         )}
      </Flex>
   )
}

export default Shop;