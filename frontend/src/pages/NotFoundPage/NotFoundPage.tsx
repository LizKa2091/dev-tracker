import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { Flex } from 'antd';
import MainLayout from '../../app/MainLayout';

const NotFoundPage: FC = () => {
   return (
      <MainLayout>
         <Flex vertical justify='center' align='center' gap='large'>
            <h2 className='title'>Страница не найдена</h2>
            <Link to='/'>Вернуться домой</Link>
         </Flex>
      </MainLayout>
   )
}

export default NotFoundPage