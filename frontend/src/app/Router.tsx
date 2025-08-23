import type { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NewNotePage from '../pages/NewNotePage/NewNotePage';
import TimeLinePage from '../pages/TimeLinePage/TimeLinePage';
import AuthPage from '../pages/AuthPage/AuthPage';
import SettingsPage from '../pages/SettingsPage/SettingsPage';
import AuthedUserRoute from '../shared/lib/router/AuthedUserRoute';
import GuestRoute from '../shared/lib/router/GuestRoute';
import HomeRoute from '../pages/HomePage/HomeRoute';

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