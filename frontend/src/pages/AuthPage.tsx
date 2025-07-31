import { type FC } from 'react'
import AuthSwitcher from '../features/auth/ui/AuthSwitcher';
import { Flex, Layout } from 'antd';
import Sidebar from '../widgets/Sidebar';
import { Content } from 'antd/es/layout/layout';
import styles from './AuthPage.module.scss';

const AuthPage: FC = () => {
   return (
      <Layout>
         <Sidebar />
         <Content className={styles.content}>
            <Flex vertical gap='large'>
               <h2 className={styles.title}>Авторизация</h2>
               <AuthSwitcher />
            </Flex>
         </Content>
      </Layout>
   )
}

export default AuthPage;