import { Avatar, Flex, Progress } from 'antd';
import { type FC } from 'react';
import { useUserData } from '../model/useUserData';
import { HeartFilled, StarFilled, UserOutlined } from '@ant-design/icons';
import AuthExports from '../../../shared/context/AuthContext';
import { calcProgress, calcXpForLevel } from '../lib/calcXp';
import GitHubLoginButton from '../../github-auth/ui/GitHubLoginButton/GitHubLoginButton';
import styles from './UserProfile.module.scss';

const UserProfile: FC = () => {
   const { token } = AuthExports.useAuthContext();
   const { data, isLoading } = useUserData(token);
   const healthPercent = data ? data.health / 50 * 100 : 0;

   return (
      <Flex vertical gap='middle' className={styles.userInfoContainer}>
         <Flex align='center' gap='middle'>
            <Avatar size={48} src={data?.profilePic ? data?.profilePic : <UserOutlined />} />
            <p className={styles.nickname}>{isLoading ? 'Загрузка...' : data?.name || 'Гость' }</p>
         </Flex>
         <GitHubLoginButton />
         <Flex vertical>
            {data &&
               <Flex justify='center' align='center' gap='small' className={styles.progressContainer}>
                  <HeartFilled className={styles.heart} />
                  <Progress percent={healthPercent} showInfo={false} strokeColor='red' size='small' />
                  {data.health}/50
               </Flex>
            }
         </Flex>
         <Flex justify='space-between' vertical gap='small'>
            {data && 
               <>
                  <Flex justify='center' align='center' gap='small' className={styles.progressContainer}>
                     <StarFilled className={styles.xp} />
                     <Progress percent={calcProgress(data)} showInfo={false} strokeColor='blue' size='small' />
                     {data.xp}/{calcXpForLevel(data.level) + data.xpForNextLevel}
                  </Flex>
                  <p className={styles.level}>Уровень {data?.level}</p>
               </>
            }
         </Flex>
      </Flex>
   )
}

export default UserProfile;