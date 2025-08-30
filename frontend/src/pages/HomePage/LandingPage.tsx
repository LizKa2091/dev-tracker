import { Button, Flex, Layout } from 'antd';
import type { FC } from 'react'
import Sidebar from '../../widgets/Sidebar/ui/Sidebar';
import { Content } from 'antd/es/layout/layout';
import DeadlineChart from '../../features/deadlines/ui/DeadlineChart';
import { Link } from 'react-router-dom';
import Notifications from '../../shared/notifications/ui/Notifications/Notifications';

const LandingPage: FC = () => {
   return (
      <Layout className='mainLayout'>
         <Sidebar />
         <Content className='content'>
            <Flex vertical gap={36}>
               <h2 className='title'>Главная</h2>
               <Flex vertical justify='center' align='center' gap='middle'>
                  <h3>Следи за дедлайнами и не пропускай задачи</h3>
                  <h4>DevTracker поможет отследить прогресс, выстроить дисциплину и получить удовольствие</h4>
                  <Button color="default" variant="solid">
                     <Link to='/auth'>Войти</Link>
                  </Button>
               </Flex>
               <Flex vertical>
                  <h3>Так может выглядеть твой прогресс</h3>
                  <DeadlineChart type='demo' />
               </Flex>
            </Flex>
         </Content>
         <Notifications />
      </Layout>
   )
}

export default LandingPage;