import type { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NewNotePage from '../pages/NewNotePage/NewNotePage';
import TimeLinePage from '../pages/TimeLinePage/TimeLinePage';
import AuthPage from '../pages/AuthPage/AuthPage';
import SettingsPage from '../pages/SettingsPage/SettingsPage';
import AuthedUserRoute from '../shared/lib/router/AuthedUserRoute';
import GuestRoute from '../shared/lib/router/GuestRoute';
import HomeRoute from '../pages/HomePage/HomeRoute';
import ResetPasswordPage from '../pages/ResetPasswordPage/ResetPasswordPage';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import GithubHandlingPage from '../pages/GithubHandlingPage/GithubHandlingPage';
import ShopPage from '../pages/ShopPage/ShopPage';
import StatsPage from '../pages/StatsPage/StatsPage';

const Router: FC = () => {
   return (
      <BrowserRouter>
         <Routes>
            <Route path='/' element={<HomeRoute />} />
            <Route path='/timeline' element={
                  <AuthedUserRoute>
                     <TimeLinePage />
                  </AuthedUserRoute>
               } 
            />
            <Route path='/new-note' element={<NewNotePage />} />
            <Route path='/stats' element={
               <AuthedUserRoute>
                  <StatsPage />
               </AuthedUserRoute>
            } />
            <Route path='/settings' element={
                  <AuthedUserRoute>
                     <SettingsPage />
                  </AuthedUserRoute>
               } 
            />
            <Route path='/auth' element={
                  <GuestRoute>
                     <AuthPage />
                  </GuestRoute>
               }
            />
            <Route path='/reset-password' element={
                  <GuestRoute>
                     <ResetPasswordPage />
                  </GuestRoute>
            } />
            <Route path='/shop' element={<ShopPage />} />
            <Route path='/github/success' element={
                  <AuthedUserRoute>
                     <GithubHandlingPage />
                  </AuthedUserRoute>
            } />
            <Route path='*' element={<NotFoundPage />} />
         </Routes>
      </BrowserRouter>
   )
}

export default Router;