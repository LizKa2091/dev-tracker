import { type FC } from 'react';
import { Flex, Layout } from 'antd';
import Sidebar from '../../widgets/Sidebar';
import NewNote from '../../features/notes/ui/NewNote/NewNote';

const { Content } = Layout;

const NewNotePage: FC = () => {
   return (
      <>
         <Layout>
            <Sidebar />
            <Content className='content'>
               <Flex vertical gap='large'>
                  <h2 className='title'>Новая запись</h2>
                  <NewNote />
               </Flex>
            </Content>
         </Layout>
      </>
   )
}

export default NewNotePage;