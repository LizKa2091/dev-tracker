import { Flex, Layout } from 'antd';
import type { FC } from 'react';
import Sidebar from '../../widgets/Sidebar/ui/Sidebar';
import Notifications from '../../shared/notifications/ui/Notifications/Notifications';
import Shop from '../../features/shop-buy-item/ui/Shop/Shop';

const { Content } = Layout;

const ShopPage: FC = () => {
   return (
      <Layout className='mainLayout'>
         <Sidebar />
         <Content className='content'>
            <Flex vertical gap='large'>
               <h2 className='title'>Магазин</h2>
               <h3>Нажмите на товар для покупки за XP. Чтобы увидеть описание, наведите курсором мыши на товар</h3>
               <Shop />
            </Flex>
         </Content>
         <Notifications />
      </Layout>
   )
}

export default ShopPage;