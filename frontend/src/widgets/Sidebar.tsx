import type { FC } from 'react';
import { Button, Flex, Layout, Menu } from 'antd';
import { HistoryOutlined, FormOutlined, BarChartOutlined, SettingOutlined, LogoutOutlined } from "@ant-design/icons";
import styles from './Sidebar.module.scss';

const { Sider } = Layout;

const menuItems = [
   { key: 'timeline', icon: <HistoryOutlined style={{ color: '#ffffff' }} />, label: 'Таймлайн' },
   { key: 'new post', icon: <FormOutlined style={{ color: '#ffffff' }} />, label: 'Новая запись' },
   { key: 'stats', icon: <BarChartOutlined style={{ color: '#ffffff' }} />, label: 'Статистика' },
   { key: 'settings', icon: <SettingOutlined style={{ color: '#ffffff' }} />, label: 'Настройки' }
];

const Sidebar: FC = () => {
   return (
      <>
         <Sider className={styles.sider}>
            <Flex vertical className={styles.siderContainer}>
               <p className={styles.logo}>DevTracker</p>
               <Flex vertical gap='middle' className={styles.userInfoContainer}>
                  <p className={styles.nickname}>nickname</p>
                  <Flex justify='space-between'>
                     <p className={styles.xp}>XP: 1290</p>
                     <p className={styles.level}>Уровень 5</p>
                  </Flex>
               </Flex>
               <Menu items={menuItems} className={styles.menu} />
               <Button type='text' icon={<LogoutOutlined />} className={styles.logout}>Выйти</Button>
            </Flex>
         </Sider>
      </>
   )
}

export default Sidebar;