import { type FC } from 'react';
import { Flex, Layout } from 'antd';
import Sidebar from '../widgets/Sidebar';
import styles from './NewNotePage.module.scss';
import NewNote from '../features/notes/NewNote';
// import RecentNotes from '../features/notes/RecentNotes';

const { Content } = Layout;

const NewNotePage: FC = () => {
   return (
      <>
         <Layout>
            <Sidebar />
            <Content className={styles.content}>
               <Flex vertical gap='large'>
                  <h2 className={styles.title}>Новая запись</h2>
                  <NewNote />
                  {/* <RecentNotes /> */}
               </Flex>
            </Content>
         </Layout>
      </>
   )
}

export default NewNotePage;