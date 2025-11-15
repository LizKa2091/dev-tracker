import dayjs from 'dayjs';
import { useEffect, useState, type FC } from 'react';
import { Button, Card, Flex } from 'antd';
import { getIncomingDeadline } from '../lib/getIncomingDeadline';
import AuthExports from '../../../shared/context/AuthContext';
import type { INoteItem } from '../../notes/noteTypes';
import styles from './IncomingDeadline.module.scss';

const IncomingDeadline: FC = () => {
   const [currDeadline, setCurrDeadline] = useState<INoteItem | null>(null);
   const [isHidden, setIsHidden] = useState<boolean>(false);
   const { isAuthed } = AuthExports.useAuthContext();

   useEffect(() => {
      if (isAuthed) setCurrDeadline(getIncomingDeadline());
   }, [isAuthed]);

   if (!currDeadline) {
      return null;
   }

   return (
      <Flex vertical justify='center' align='center' gap='small'>
         <p>Приближающийся дедлайн</p>
         {!isHidden && 
            <Card title={currDeadline.title} size='small' className={styles.card}>
               <p>Срок: {dayjs(currDeadline.dueToDate).format('YYYY-MM-DD')}</p>
            </Card>
         }
         <Button color="default" variant="solid" onClick={() => setIsHidden(prev => !prev)}>{isHidden ? 'Показать' : 'Спрятать'}</Button>
      </Flex>
   )
}

export default IncomingDeadline;