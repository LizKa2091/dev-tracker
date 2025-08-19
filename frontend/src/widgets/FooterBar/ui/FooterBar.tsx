import { type FC } from 'react';
import { Layout } from 'antd';
import { Link } from 'react-router-dom';
import { ExportOutlined } from '@ant-design/icons';

const { Footer } = Layout;

const FooterBar: FC = () => {
   return (
      <Footer className='footer'>
         <p>Проект создан LizKa2091 <Link to='https://github.com/LizKa2091' target='_blank' data-testid='footer-link'>Github <ExportOutlined /></Link></p>
      </Footer>
   )
}

export default FooterBar;