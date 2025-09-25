import type { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Flex, Grid, Layout, Menu } from 'antd';
import { HistoryOutlined, FormOutlined, BarChartOutlined, SettingOutlined, LogoutOutlined, LoginOutlined, ShopOutlined } from "@ant-design/icons";
import AuthExports from '../../../shared/context/AuthContext';
import UserProfile from '../../../features/user/ui/UserProfile';
import IncomingDeadline from '../../../features/incoming-deadline/ui/IncomingDeadline';
import styles from './Sidebar.module.scss';

const { Sider } = Layout;
const { useAuthContext } = AuthExports;
const { useBreakpoint } = Grid;

const menuItems = [
   { key: 'timeline', path: '/timeline', icon: <HistoryOutlined style={{ color: '#ffffff' }} />, label: <Link to='/timeline'>Таймлайн</Link> },
   { key: 'new post', path: '/new-post', icon: <FormOutlined style={{ color: '#ffffff' }} />, label: <Link to='/new-note'>Новая запись</Link> },
   { key: 'stats', path: '/stats', icon: <BarChartOutlined style={{ color: '#ffffff' }} />, label: <Link to='/stats'>Статистика</Link> },
   { key: 'shop', path: '/shop', icon: <ShopOutlined style={{ color: '#ffffff' }} />, label: <Link to='/shop'>Магазин</Link> },
   { key: 'settings', path: '/settings', icon: <SettingOutlined style={{ color: '#ffffff' }} />, label: <Link to='/settings'>Настройки</Link> }
];

const Sidebar: FC = () => {
   const { token } = AuthExports.useAuthContext();
   const { logout } = useAuthContext();
   const navigate = useNavigate();
   const screens = useBreakpoint();

   const handleLogout = (): void => {
      if (token) {
         logout();

         navigate('/');
      }
   }

   const isMobile = !screens.md;

   return (
      <Sider width={isMobile ? 140 : 200} collapsedWidth={0} breakpoint='md' className={styles.sider}>
         <Flex vertical className={styles.siderContainer}>
            <h1 className={styles.logo}>
               <Link to='/'>DevTracker</Link>
            </h1>
            <UserProfile />
            <Menu items={menuItems} className={styles.menu} />
            {token ? (
               <Button type='text' onClick={handleLogout} icon={<LogoutOutlined />} iconPosition='end' className={styles.logout}>Выйти</Button>
            ) : (
               <Link to='/auth' className={styles.login}>
                  <Button type='text' icon={<LoginOutlined />}>Войти</Button>
               </Link>
            )}
            <Flex justify='center' align='center'>
               <IncomingDeadline />
            </Flex>
         </Flex>
      </Sider>
   )
}

export default Sidebar