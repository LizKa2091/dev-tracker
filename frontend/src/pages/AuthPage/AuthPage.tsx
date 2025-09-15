import { type FC } from 'react';
import { Flex, Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import AuthSwitcher from '../../features/auth/ui/AuthSwitcher/AuthSwitcher';
import Sidebar from '../../widgets/Sidebar/ui/Sidebar';
import FooterBar from '../../widgets/FooterBar/ui/FooterBar';
import Notifications from '../../shared/notifications/ui/Notifications/Notifications';

const AuthPage: FC = () => {
   return (
      <Layout className='mainLayout'>
         <Sidebar />
         <Layout>
            <Content className='content'>
               <Flex vertical gap='large'>
                  <h2 className='title'>Авторизация</h2>
                  <AuthSwitcher />
               </Flex>
            </Content>
            <FooterBar />
         </Layout>
         <Notifications />
      </Layout>
   )
}

export default AuthPage;