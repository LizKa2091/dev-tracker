import { type FC } from 'react';
import { Flex, Layout } from 'antd';
import Sidebar from '../../widgets/Sidebar/ui/Sidebar';
import { Link } from 'react-router-dom';
import Notifications from '../../shared/notifications/ui/Notifications/Notifications';

const { Content } = Layout;

const NotFoundPage: FC = () => {
   return (
      <Layout className='mainLayout'>
         <Sidebar />
         <Content className='content'>
            <Flex vertical justify='center' align='center' gap='large'>
               <h2 className='title'>Страница не найдена</h2>
               <Link to='/'>Вернуться домой</Link>
            </Flex>
         </Content>
         <Notifications />
      </Layout>
   )
}

export default NotFoundPage;