import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Button, Flex } from 'antd';
import MainLayout from '../../app/MainLayout';
import DeadlineChart from '../../features/deadlines/ui/DeadlineChart';
import styles from './LangingPage.module.scss';

const LandingPage: FC = () => {
   return (
      <MainLayout>
         <Flex vertical gap={36} className={styles.container}>
            <h2 className="title">Главная</h2>
            <Flex vertical justify="center" align="center" gap="middle">
               <h3>Следи за дедлайнами и не пропускай задачи</h3>
               <h4>
                  DevTracker поможет отследить прогресс, выстроить дисциплину и
                  получить удовольствие
               </h4>
               <Button color="default" variant="solid">
                  <Link to="/auth">Войти</Link>
               </Button>
            </Flex>
            <Flex vertical>
               <h3>Так может выглядеть твой прогресс</h3>
               <DeadlineChart type="demo" />
            </Flex>
         </Flex>
      </MainLayout>
   );
};

export default LandingPage;
