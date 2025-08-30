import { Flex, Layout } from 'antd';
import type { FC } from 'react'
import Sidebar from '../../widgets/Sidebar/ui/Sidebar';
import { Content } from 'antd/es/layout/layout';
import GitHubParams from '../../features/github-auth/ui/GitHubParams/GitHubParams';
import Notifications from '../../shared/notifications/ui/Notifications/Notifications';

const GithubHandlingPage: FC = () => {
   return (
      <Layout className='mainLayout'>
         <Sidebar />
         <Content className='content'>
            <Flex vertical justify='center' align='center' gap='large'>
               <GitHubParams />
            </Flex>
         </Content>
         <Notifications />
      </Layout>
   )
}

export default GithubHandlingPage;