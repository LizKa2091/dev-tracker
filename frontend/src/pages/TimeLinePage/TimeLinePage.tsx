import type { FC } from 'react';
import { Flex, Layout } from 'antd';
import Sidebar from '../../widgets/Sidebar/ui/Sidebar';
import UserTimeline from '../../features/timeline/ui/UserTimeline';
import Notifications from '../../shared/notifications/ui/Notifications/Notifications';

const { Content } = Layout;

const TimeLinePage: FC = () => {
   return (
      <Layout className='mainLayout'>
         <Sidebar />
         <Content className='content'>
            <Flex vertical gap='large'>
               <h2 className='title'>Таймлайн</h2>
               <UserTimeline />
            </Flex>
         </Content>
         <Notifications />
      </Layout>
   )
}

export default TimeLinePage;