import { type FC } from 'react';
import { Button, Flex, Layout, Menu } from 'antd';
import { HistoryOutlined, FormOutlined, BarChartOutlined, SettingOutlined, LogoutOutlined, LoginOutlined } from "@ant-design/icons";
import { Link, useNavigate } from 'react-router-dom';
import AuthExports from '../shared/context/AuthContext';
import styles from './Sidebar.module.scss';

const { Sider } = Layout;
const { useAuthContext } = AuthExports;

const menuItems = [
   { key: 'timeline', path: '/timeline', icon: <HistoryOutlined style={{ color: '#ffffff' }} />, label: <Link to='/'>Таймлайн</Link> },
   { key: 'new post', path: '/new-post', icon: <FormOutlined style={{ color: '#ffffff' }} />, label: <Link to='/new-note'>Новая запись</Link> },
   { key: 'stats', icon: <BarChartOutlined style={{ color: '#ffffff' }} />, label: 'Статистика' },
   { key: 'settings', icon: <SettingOutlined style={{ color: '#ffffff' }} />, label: 'Настройки' }
];

const Sidebar: FC = () => {
   const { isAuthed, logout } = useAuthContext();
   const navigate = useNavigate();

   const handleLogout = (): void => {
      const token: string | null = localStorage.getItem('token');

      if (token) {
         logout(token);

         navigate('/');
      }
   };

   return (
      <>
         <Sider className={styles.sider}>
            <Flex vertical className={styles.siderContainer}>
               <h1 className={styles.logo}>DevTracker</h1>
               <Flex vertical gap='middle' className={styles.userInfoContainer}>
                  <p className={styles.nickname}>nickname</p>
                  <Flex justify='space-between'>
                     <p className={styles.xp}>XP: 1290</p>
                     <p className={styles.level}>Уровень 5</p>
                  </Flex>
               </Flex>
               <Menu items={menuItems} className={styles.menu} />
               {isAuthed ? (
                  <Button type='text' onClick={handleLogout} icon={<LogoutOutlined />} iconPosition='end' className={styles.logout}>Выйти</Button>
               ) : (
                  <Link to='/auth' className={styles.login}>
                     <Button type='text' icon={<LoginOutlined />}>Войти</Button>
                  </Link>
               )}
            </Flex>
         </Sider>
      </>
   )
}

export default Sidebar;