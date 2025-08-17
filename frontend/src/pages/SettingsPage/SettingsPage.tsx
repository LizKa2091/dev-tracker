import { type FC } from 'react';
import { Flex, Layout } from 'antd';
import Sidebar from '../../widgets/Sidebar';
import styles from './SettingsPage.module.scss';
import ProfileSettings from '../../features/settings/ui/ProfileSettings';
import TagsSettings from '../../features/settings/ui/Tags/TagsSettings';
import SecuritySettings from '../../features/settings/ui/SecuritySettings/SecuritySettings';

const { Content } = Layout;

const SettingsPage: FC = () => {
   return (
      <Layout>
         <Sidebar />
         <Content className={styles.content}>
            <Flex vertical gap='large'>
               <h2 className={styles.title}>Настройки</h2>
               <ProfileSettings />
               <TagsSettings />
               <SecuritySettings />
            </Flex>
         </Content>
      </Layout>
   )
}

export default SettingsPage;