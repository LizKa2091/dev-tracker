import { type FC, type ReactNode } from 'react';
import { Layout } from 'antd';
import Sidebar from '../widgets/Sidebar/ui/Sidebar';
import FooterBar from '../widgets/FooterBar/ui/FooterBar';
import Notifications from '../shared/notifications/ui/Notifications/Notifications';

const { Content } = Layout;

interface IMainLayoutProps {
   children: ReactNode;
}

const MainLayout: FC<IMainLayoutProps> = ({ children }) => {
   return (
      <Layout className='mainLayout'>
         <Sidebar />
         <Layout>
            <Content className='content'>
               {children}
            </Content>
            <FooterBar />
         </Layout>
         <Notifications />
      </Layout>
   )
}

export default MainLayout