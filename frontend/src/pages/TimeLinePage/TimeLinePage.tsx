import type { FC } from 'react';
import { Flex } from 'antd';
import MainLayout from '../../app/MainLayout';
import UserTimeline from '../../features/timeline/ui/UserTimeline/UserTimeline';

const TimeLinePage: FC = () => {
   return (
      <MainLayout>
         <Flex vertical gap='large'>
            <h2 className='title'>Таймлайн</h2>
            <UserTimeline />
         </Flex>
      </MainLayout>
   )
}

export default TimeLinePage