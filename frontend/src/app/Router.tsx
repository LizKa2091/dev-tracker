import type { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import NewNotePage from '../pages/NewNotePage';

const Router: FC = () => {
   return (
      <>
         <BrowserRouter>
            <Routes>
               <Route element={<HomePage />} path='/' />
               <Route element={<NewNotePage />} path='/new-note' />
            </Routes>
         </BrowserRouter>
      </>
   )
}

export default Router;