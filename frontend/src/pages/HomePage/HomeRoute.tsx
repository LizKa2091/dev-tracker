import type { FC } from 'react';
import AuthExports from '../../shared/context/AuthContext';
import HomePage from './HomePage';
import LandingPage from './LandingPage';

const HomeRoute: FC = () => {
   const { token } = AuthExports.useAuthContext();
   
   if (token) return <HomePage />;

   return <LandingPage />
}

export default HomeRoute;