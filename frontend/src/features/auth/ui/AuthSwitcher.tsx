import { Button, Flex } from 'antd';
import { useState, type FC } from 'react'
import LoginForm from './LoginForm/LoginForm';
import RegisterForm from './RegisterForm/RegisterForm';

const AuthSwitcher: FC = () => {
   const [isLoginActive, setIsLoginActive] = useState<boolean>(true);

   return (
      <Flex vertical gap='large'>
         {isLoginActive ? (
            <LoginForm />
         ) : (
            <RegisterForm />
         )}
         <Button onClick={() => setIsLoginActive(prev => !prev)} color="default" variant="solid" style={{ width: 'fit-content' }}>{isLoginActive ? 'Для регистрации нажмите сюда' : 'Для входа в аккаунт нажмите сюда'}</Button>
      </Flex>
   )
}

export default AuthSwitcher
