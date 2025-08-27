import { Avatar, Flex, Progress } from 'antd';
import { type FC } from 'react';
import { useUserData } from '../model/useUserData';
import { UserOutlined } from '@ant-design/icons';
import AuthExports from '../../../shared/context/AuthContext';
import { calcProgress, calcXpForLevel } from '../lib/calcXp';
import styles from './UserProfile.module.scss';
import GitHubLoginButton from '../../github-auth/ui/GitHubLoginButton/GitHubLoginButton';

const UserProfile: FC = () => {
   const { token } = AuthExports.useAuthContext();
   const { data, isLoading } = useUserData(token);

   return (
      <Flex vertical gap='middle' className={styles.userInfoContainer}>
         <Flex align='center' gap='middle'>
            <Avatar size={48} src={data?.profilePic ? data?.profilePic : <UserOutlined />} />
            <p className={styles.nickname}>{isLoading ? 'Загрузка...' : data?.name || 'Гость' }</p>
         </Flex>
         <GitHubLoginButton />
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