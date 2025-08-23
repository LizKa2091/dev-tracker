import type { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage/HomePage';
import NewNotePage from '../pages/NewNotePage/NewNotePage';
import TimeLinePage from '../pages/TimeLinePage/TimeLinePage';
import AuthPage from '../pages/AuthPage/AuthPage';
import SettingsPage from '../pages/SettingsPage/SettingsPage';
import AuthedUserRoute from '../shared/lib/router/AuthedUserRoute';
import GuestRoute from '../shared/lib/router/GuestRoute';

const Router: FC = () => {
   return (
      <BrowserRouter>
         <Routes>
            <Route element={<HomePage />} path='/' />
            <Route path='/timeline' element={
                  <AuthedUserRoute>
                     <TimeLinePage />
                  </AuthedUserRoute>
               } 
            />
            <Route element={<NewNotePage />} path='/new-note' />
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
         </Routes>
      </BrowserRouter>
   )
}

export default Router;