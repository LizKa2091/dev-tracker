import { type FC } from 'react';
import { Flex } from 'antd';
import MainLayout from '../../app/MainLayout';
import NewNote from '../../features/notes/ui/NewNote/NewNote';

const NewNotePage: FC = () => {
   return (
      <MainLayout>
         <Flex vertical gap='large'>
            <h2 className='title'>Новая запись</h2>
            <NewNote />
         </Flex>
      </MainLayout>
   )
}

export default NewNotePage