import { Flex, Layout } from 'antd';
import type { FC } from 'react';
import Sidebar from '../../widgets/Sidebar/ui/Sidebar';
import Notifications from '../../shared/notifications/ui/Notifications/Notifications';

const { Content } = Layout;

const StatsPage: FC = () => {
   return (
      <Layout className='mainLayout'>
         <Sidebar />
         <Content className='content'>
            <Flex vertical gap='large'>
               <h2 className='title'>Статистика</h2>
            </Flex>
         </Content>
         <Notifications />
      </Layout>
   )
}

export default StatsPage;