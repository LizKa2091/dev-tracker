import type { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage/HomePage';
import NewNotePage from '../pages/NewNotePage/NewNotePage';
import TimeLinePage from '../pages/TimeLinePage/TimeLinePage';
import AuthPage from '../pages/AuthPage/AuthPage';
import SettingsPage from '../pages/SettingsPage/SettingsPage';

const Router: FC = () => {
   return (
      <>
         <BrowserRouter>
            <Routes>
               <Route element={<HomePage />} path='/' />
               <Route element={<TimeLinePage />} path='/timeline' />
               <Route element={<NewNotePage />} path='/new-note' />
               <Route element={<SettingsPage />} path='/settings' />
               <Route element={<AuthPage />} path='/auth' />
            </Routes>
         </BrowserRouter>
      </>
   )
}

export default Router;