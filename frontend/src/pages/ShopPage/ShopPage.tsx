import type { FC } from 'react';
import { Flex } from 'antd';
import MainLayout from '../../app/MainLayout';
import Shop from '../../features/shop-buy-item/ui/Shop/Shop';

const ShopPage: FC = () => {
   return (
      <MainLayout>
         <Flex vertical gap='large'>
            <h2 className='title'>Магазин</h2>
            <h3>Нажмите на товар для покупки за XP. Чтобы увидеть описание, наведите курсором мыши на товар</h3>
            <Shop />
         </Flex>
      </MainLayout>
   )
}

export default ShopPage