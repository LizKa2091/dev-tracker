import type { FC } from 'react';
import { GithubOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import AuthExports from '../../../../shared/context/AuthContext';
import styles from './GitHubLoginButton.module.scss';

const GitHubLoginButton: FC = () => {
   const { token } = AuthExports.useAuthContext();
   const githubToken = localStorage.getItem('githubToken');

   const handleClick = () => {
      window.location.href = 'http://localhost:5001/auth/github';
   }

   if (githubToken || !token) {
      return null;
   }

   return (
      <Button color="default" variant="solid" icon={<GithubOutlined />} onClick={handleClick} className={styles.button}>Связать с GitHub</Button>
   )
}

export default GitHubLoginButton;