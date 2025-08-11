import type { FC } from 'react';
import { Flex, Layout } from 'antd';
import Sidebar from '../../widgets/Sidebar';
import UserTimeline from '../../features/timeline/ui/UserTimeline';
import styles from './TimeLinePage.module.scss';

const { Content } = Layout;

const TimeLinePage: FC = () => {
   return (
      <Layout>
         <Sidebar />
         <Content className={styles.content}>
            <Flex vertical gap='large'>
               <h2 className={styles.title}>Таймлайн</h2>
               <UserTimeline />
            </Flex>
         </Content>
      </Layout>
   )
}

export default TimeLinePage;