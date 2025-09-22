import { Flex } from 'antd';
import type { FC } from 'react';
import MainLayout from '../../app/MainLayout';
import ActivityCells from '../../features/activity-cells/ui/ActivityCells/ActivityCells';

const StatsPage: FC = () => {
   return (
      <MainLayout>
         <Flex vertical gap='large'>
            <h2 className='title'>Статистика</h2>
            <ActivityCells />
         </Flex>
      </MainLayout>
   )
}

export default StatsPage