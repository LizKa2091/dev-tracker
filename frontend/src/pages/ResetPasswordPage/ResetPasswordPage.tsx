import type { FC } from 'react';
import Sidebar from '../../widgets/Sidebar/ui/Sidebar';
import { Flex, Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import FooterBar from '../../widgets/FooterBar/ui/FooterBar';
import ResetPasswordForm from '../../features/auth/ui/ResetPasswordForm/ResetPasswordForm';
import Notifications from '../../shared/notifications/ui/Notifications/Notifications';

const ResetPasswordPage: FC = () => {
   return (
      <Layout className='mainLayout'>
         <Sidebar />
         <Layout>
            <Content className='content'>
               <Flex vertical gap='large'>
                  <h2 className='title'>Сброс пароля</h2>
                  <ResetPasswordForm />
               </Flex>
            </Content>
            <FooterBar />
         </Layout>
         <Notifications />
      </Layout>
   )
};

export default ResetPasswordPage;