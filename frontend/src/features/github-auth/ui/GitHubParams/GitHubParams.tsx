import { Spin } from 'antd';
import { useEffect, type FC } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

const GitHubParams: FC = () => {
   const location = useLocation();
   const navigate = useNavigate();

   useEffect(() => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');

      if (token) {
         localStorage.setItem('githubToken', token);

         navigate('/');
      }
      else {
         navigate('/auth');
      }
   }, [navigate, location]);
   
   return (
      <>
         <h2 className='title'>Пожалуйста, подождите, идёт получение данных</h2>
         <Spin size='large' />
      </>
   )
}

export default GitHubParams
