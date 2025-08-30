import { Flex } from 'antd';
import type { FC } from 'react';
import DifficultySwitcher from '../../Difficulty/DifficultySwitcher';
import AvatarForm from '../AvatarForm/AvatarForm';
import UserDataForm from '../UserDataForm/UserDataForm';
import GitHubLoginButton from '../../../../github-auth/ui/GitHubLoginButton/GitHubLoginButton';
import styles from './ProfileSettings.module.scss';

const ProfileSettings: FC = () => {
   return (
      <Flex vertical gap='large' className={styles.container}>
         <h3>Профиль</h3>
         <UserDataForm />
         <DifficultySwitcher />
         <AvatarForm />
         <Flex vertical gap='middle' className={styles.githubContainer}>
            <h4>Связать профиль с Github, чтобы получать опыт за коммиты</h4>
            <GitHubLoginButton />
         </Flex>
      </Flex>
   )
}

export default ProfileSettings;