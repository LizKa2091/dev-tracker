import { Avatar, Flex, Progress } from 'antd';
import { useEffect, useState, type FC } from 'react';
import { useUserData } from '../model/useUserData';
import { type IUserDataResponse } from '../userTypes';
import { UserOutlined } from '@ant-design/icons';
import styles from './UserProfile.module.scss';

interface IUserProfileProps {
   isAuthed: boolean;
};

const UserProfile: FC<IUserProfileProps> = ({ isAuthed }) => {
   const [token, setToken] = useState<string | null>(null);

   const { data, isLoading } = useUserData(token);

   useEffect(() => {
      setToken(localStorage.getItem('token'));
   }, [isAuthed]);

   const calcProgress = (data: IUserDataResponse): number => {
      if (!data) return 0;

      const currLevelXp: number = data.xp - calcXpForLevel(data.level);

      return Math.round((currLevelXp / data.xpForNextLevel) * 100);
   };

   const calcXpForLevel = (level: number): number => {
      let res: number = 0;
      
      for (let i: number = 1; i<level; i++) {
         res += i*100;
      }

      return res;
   };

   return (
      <Flex vertical gap='middle' className={styles.userInfoContainer}>
         <Flex align='center' gap='middle'>
            <Avatar size={48} src={data?.profilePic ? data?.profilePic : <UserOutlined />} />
            <p className={styles.nickname}>{isLoading ? 'Загрузка...' : data?.name || 'Гость' }</p>
         </Flex>
         <Flex justify='space-between' vertical gap='small'>
            <p className={styles.xp}>XP: {isLoading ? 'Загрузка...' : data?.xp || 0 }</p>
            {data && 
               <>
                  <Flex gap='small'>
                     {calcXpForLevel(data.level)}
                     <Progress percent={calcProgress(data)} size='small' />
                     {calcXpForLevel(data.level) + data.xpForNextLevel}
                  </Flex>
                  <p className={styles.level}>Уровень {data?.level}</p>
               </>
            }
         </Flex>
      </Flex>
   )
}

export default UserProfile;