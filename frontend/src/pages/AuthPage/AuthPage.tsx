import { type FC } from 'react';
import { Flex } from 'antd';
import MainLayout from '../../app/MainLayout';
import AuthSwitcher from '../../features/auth/ui/AuthSwitcher/AuthSwitcher';

const AuthPage: FC = () => {
   return (
      <MainLayout>
         <Flex vertical gap='large'>
            <h2 className='title'>Авторизация</h2>
            <AuthSwitcher />
         </Flex>
      </MainLayout>
   )
}

export default AuthPage