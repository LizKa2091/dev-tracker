import type { FC } from 'react';
import { Flex, Layout, Menu } from 'antd';
import { HistoryOutlined, FormOutlined, BarChartOutlined, SettingOutlined } from "@ant-design/icons";
// import styles from './Sidebar.module.scss';

const { Sider } = Layout;

const menuItems = [
   { key: 'timeline', icon: <HistoryOutlined />, label: 'Таймлайн' },
   { key: 'new post', icon: <FormOutlined />, label: 'Новая запись' },
   { key: 'stats', icon: <BarChartOutlined />, label: 'Статистика' },
   { key: 'settings', icon: <SettingOutlined />, label: 'Настройки' },
];

const Sidebar: FC = () => {
   return (
      <>
         <Sider>
            <Flex>
               nickname
               XP: 1290
            </Flex>
            <Menu items={menuItems} />
         </Sider>
      </>
   )
}

export default Sidebar;