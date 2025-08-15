import { useState, type FC } from 'react'
import AddCustomTag from './AddCustomTag';
import { Button } from 'antd';

const TagsSettings: FC = () => {
   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

   return (
      <>
         <Button color="default" variant="solid" onClick={() => setIsModalOpen(true)}>Добавить новый тэг</Button>
         <AddCustomTag isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      </>
   )
}

export default TagsSettings;