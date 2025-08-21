import { type FC } from 'react';
import { Button, Flex, Layout, Menu } from 'antd';
import { HistoryOutlined, FormOutlined, BarChartOutlined, SettingOutlined, LogoutOutlined, LoginOutlined } from "@ant-design/icons";
import { Link, useNavigate } from 'react-router-dom';
import AuthExports from '../shared/context/AuthContext';
import styles from './Sidebar.module.scss';
import UserProfile from '../features/user/ui/UserProfile';

const { Sider } = Layout;
const { useAuthContext } = AuthExports;

const menuItems = [
   { key: 'timeline', path: '/timeline', icon: <HistoryOutlined style={{ color: '#ffffff' }} />, label: <Link to='/'>Таймлайн</Link> },
   { key: 'new post', path: '/new-post', icon: <FormOutlined style={{ color: '#ffffff' }} />, label: <Link to='/new-note'>Новая запись</Link> },
   { key: 'stats', icon: <BarChartOutlined style={{ color: '#ffffff' }} />, label: 'Статистика' },
   { key: 'settings', path: '/settings', icon: <SettingOutlined style={{ color: '#ffffff' }} />, label: <Link to='/settings'>Настройки</Link> }
];

const Sidebar: FC = () => {
   const { token } = AuthExports.useAuthContext();
   const { logout } = useAuthContext();
   const navigate = useNavigate();

   const handleLogout = (): void => {
      if (token) {
         logout(token);

         navigate('/');
      }
   };

   return (
      <Sider className={styles.sider}>
         <Flex vertical className={styles.siderContainer}>
            <h1 className={styles.logo}>DevTracker</h1>
            <UserProfile />
            <Menu items={menuItems} className={styles.menu} />
            {token ? (
               <Button type='text' onClick={handleLogout} icon={<LogoutOutlined />} iconPosition='end' className={styles.logout}>Выйти</Button>
            ) : (
               <Link to='/auth' className={styles.login}>
                  <Button type='text' icon={<LoginOutlined />}>Войти</Button>
               </Link>
            )}
         </Flex>
      </Sider>
   )
}

export default Sidebar;