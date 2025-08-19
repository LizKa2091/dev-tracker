import { type FC } from 'react'
import AuthSwitcher from '../../features/auth/ui/AuthSwitcher';
import { Flex, Layout } from 'antd';
import Sidebar from '../../widgets/Sidebar';
import { Content } from 'antd/es/layout/layout';
import FooterBar from '../../widgets/FooterBar/ui/FooterBar';

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
      </Layout>
   )
}

export default AuthPage;