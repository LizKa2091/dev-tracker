import type { FC } from 'react';
import { Flex } from 'antd';
import MainLayout from '../../app/MainLayout';
import DeadlineChart from '../../features/deadlines/ui/DeadlineChart';
import styles from './HomePage.module.scss';

const HomePage: FC = () => {
   return (
      <MainLayout>
         <Flex vertical gap="large" className={styles.container}>
            <h2 className="title">Главная</h2>
            <DeadlineChart />
         </Flex>
      </MainLayout>
   );
};

export default HomePage;
