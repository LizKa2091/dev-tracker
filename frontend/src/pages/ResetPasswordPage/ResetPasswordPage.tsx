import type { FC } from 'react';
import { Flex } from 'antd';
import MainLayout from '../../app/MainLayout';
import ResetPasswordForm from '../../features/auth/ui/ResetPasswordForm/ResetPasswordForm';

const ResetPasswordPage: FC = () => {
   return (
      <MainLayout>
         <Flex vertical gap='large'>
            <h2 className='title'>Сброс пароля</h2>
            <ResetPasswordForm />
         </Flex>
      </MainLayout>
   )
}

export default ResetPasswordPage