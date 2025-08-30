import type { FC } from 'react';
import { Flex, Layout } from 'antd';
import Sidebar from '../../widgets/Sidebar/ui/Sidebar';
import DeadlineChart from '../../features/deadlines/ui/DeadlineChart';
import Notifications from '../../shared/notifications/ui/Notifications/Notifications';

const { Content } = Layout;

const HomePage: FC = () => {
   return (
      <Layout className='mainLayout'>
         <Sidebar />
         <Content className='content'>
            <Flex vertical gap='large'>
               <h2 className='title'>Главная</h2>
               <DeadlineChart />
            </Flex>
         </Content>
         <Notifications />
      </Layout>
   )
}
   
export default HomePage;