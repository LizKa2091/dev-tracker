import { type FC } from 'react';
import { Flex } from 'antd';
import MainLayout from '../../app/MainLayout';
import ProfileSettings from '../../features/settings/ui/Profile/ProfileSettings/ProfileSettings';
import TagsSettings from '../../features/settings/ui/Tags/TagSettings/TagsSettings';
import SecuritySettings from '../../features/settings/ui/SecuritySettings/SecuritySettings';

const SettingsPage: FC = () => {
   return (
      <MainLayout>
         <Flex vertical gap='large'>
            <h2 className='title'>Настройки</h2>
            <ProfileSettings />
            <TagsSettings />
            <SecuritySettings />
         </Flex>
      </MainLayout>
   )
}

export default SettingsPage