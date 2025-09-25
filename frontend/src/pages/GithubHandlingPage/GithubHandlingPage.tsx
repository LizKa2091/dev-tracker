import type { FC } from 'react';
import { Flex } from 'antd';
import MainLayout from '../../app/MainLayout';
import GitHubParams from '../../features/github-auth/ui/GitHubParams/GitHubParams';

const GithubHandlingPage: FC = () => {
   return (
      <MainLayout>
         <Flex vertical justify='center' align='center' gap='large'>
            <GitHubParams />
         </Flex>
      </MainLayout>
   )
}

export default GithubHandlingPage