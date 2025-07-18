import type { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';

const Router: FC = () => {
   return (
      <>
         <BrowserRouter>
            <Routes>
               <Route element={<HomePage />} path='/' />
            </Routes>
         </BrowserRouter>
      </>
   )
}

export default Router;