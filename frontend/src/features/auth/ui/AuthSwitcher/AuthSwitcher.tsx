import { Button, Flex } from 'antd';
import { useState, type FC } from 'react'
import LoginForm from '../LoginForm/LoginForm';
import RegisterForm from '../RegisterForm/RegisterForm';
import ForgotPassForm from '../ForgotPassForm/ForgotPassForm';
import styles from './AuthSwitcher.module.scss';

type AuthMode = 'login' | 'register' | 'forgot';

const AuthSwitcher: FC = () => {
   const [authMode, setAuthMode] = useState<AuthMode>('login');

   const authForm = () => {
      switch (authMode) {
         case 'login':
            return <LoginForm />;
         case 'register':
            return <RegisterForm />;
         case 'forgot':
            return <ForgotPassForm />;
         default:
            return null;
      }
   }

   return (
      <Flex vertical gap='large' className={styles.mainContainer}>
         {authForm()}

         {authMode === 'login' &&
            <Flex gap='middle'>
               <Button onClick={() => setAuthMode('register')} color="default" variant="filled">Нет аккаунта? Зарегистрироваться</Button>
               <Button onClick={() => setAuthMode('forgot')} color="default" variant="filled">Восстановить пароль</Button>
            </Flex>
         }
         {authMode === 'register' &&
            <Button onClick={() => setAuthMode('login')} color="default" variant="filled">Уже есть аккаунт? Войти</Button>
         }
         {authMode === 'forgot' &&
            <Button onClick={() => setAuthMode('login')} color="default" variant="filled">Вернуться ко входу в аккаунт</Button>
         }
      </Flex>
   )
}

export default AuthSwitcher
