import type { FC } from 'react';
import { Flex, Layout } from 'antd';
import Sidebar from '../../widgets/Sidebar';
import DeadlineChart from '../../features/deadlines/ui/DeadlineChart';
import styles from './HomePage.module.scss';

const { Content } = Layout;

const HomePage: FC = () => {
   return (
      <Layout>
         <Sidebar />
         <Content className={styles.content}>
            <Flex vertical gap='large'>
               <h2 className={styles.title}>Главная</h2>
               <DeadlineChart />
            </Flex>
         </Content>
      </Layout>
   )
}
   
export default HomePage;