import { type FC } from 'react';
import { Flex, Layout } from 'antd';
import Sidebar from '../../widgets/Sidebar/ui/Sidebar';
import ProfileSettings from '../../features/settings/ui/Profile/ProfileSettings/ProfileSettings';
import TagsSettings from '../../features/settings/ui/Tags/TagSettings/TagsSettings';
import SecuritySettings from '../../features/settings/ui/SecuritySettings/SecuritySettings';

const { Content } = Layout;

const SettingsPage: FC = () => {
   return (
      <Layout className='mainLayout'>
         <Sidebar />
         <Content className='content'>
            <Flex vertical gap='large'>
               <h2 className='title'>Настройки</h2>
               <ProfileSettings />
               <TagsSettings />
               <SecuritySettings />
            </Flex>
         </Content>
      </Layout>
   )
}

export default SettingsPage;