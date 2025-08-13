import { Flex } from 'antd';
import { useEffect, useState, type FC } from 'react';
import { useUserData } from '../model/useUserData';
import styles from './UserProfile.module.scss';

const UserProfile: FC = () => {
   const [token, setToken] = useState<string | null>(null);

   const { data, isLoading } = useUserData(token);

   useEffect(() => {
      setToken(localStorage.getItem('token'));
   }, []);

   return (
      <Flex vertical gap='middle' className={styles.userInfoContainer}>
         <p className={styles.nickname}>{isLoading ? 'Загрузка...' : data?.name || 'Гость' }</p>
         <Flex justify='space-between'>
            <p className={styles.xp}>XP: {isLoading ? 'Загрузка...' : data?.xp || 0 }</p>
            <p className={styles.level}>Уровень {data?.level}</p>
         </Flex>
      </Flex>
   )
}

export default UserProfile;