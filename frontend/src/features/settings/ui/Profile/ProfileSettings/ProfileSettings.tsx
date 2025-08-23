import { Flex } from 'antd';
import type { FC } from 'react';
import DifficultySwitcher from '../../Difficulty/DifficultySwitcher';
import AvatarForm from '../AvatarForm/AvatarForm';
import styles from './ProfileSettings.module.scss';
import UserDataForm from '../UserDataForm/UserDataForm';

const ProfileSettings: FC = () => {
   return (
      <Flex vertical gap='large' className={styles.container}>
         <h3>Профиль</h3>
         <UserDataForm />
         <DifficultySwitcher />
         <AvatarForm />
      </Flex>
   )
}

export default ProfileSettings;