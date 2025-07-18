import type { FC } from 'react';
import { Layout } from 'antd';
import Sidebar from '../widgets/Sidebar';

const { Content } = Layout;

const HomePage: FC = () => {
   return (
      <Layout>
         <Sidebar />
         <Content>
            hi
         </Content>
      </Layout>
   )
}

export default HomePage;