import { Spin } from 'antd';
import { useEffect, type FC } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useGithubSync } from '../../../github/model/useGithubSync';

const GitHubParams: FC = () => {
   const location = useLocation();
   const navigate = useNavigate();

   const params = new URLSearchParams(location.search);
   const token = params.get('token');

   useGithubSync(token);

   useEffect(() => {
      if (token) {
         localStorage.setItem('githubToken', token);

         setTimeout(() => navigate('/'), 250);
      }
      else {
         navigate('/auth');
      }
   }, [navigate, location, token]);
   
   return (
      <>
         <h2 className='title'>Пожалуйста, подождите, идёт получение данных</h2>
         <Spin size='large' />
      </>
   )
}

export default GitHubParams
