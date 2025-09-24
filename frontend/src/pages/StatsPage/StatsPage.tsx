import { Flex } from 'antd';
import type { FC } from 'react';
import MainLayout from '../../app/MainLayout';
import ActivityCells from '../../features/activity-cells/ui/ActivityCells/ActivityCells';
import styles from './StatsPage.module.scss';

const StatsPage: FC = () => {
   return (
      <MainLayout>
         <Flex vertical gap='large' className={styles.container}>
            <h2 className='title'>Статистика</h2>
            <ActivityCells />
         </Flex>
      </MainLayout>
   )
}

export default StatsPage