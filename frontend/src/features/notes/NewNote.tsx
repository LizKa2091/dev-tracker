import { Button, Flex } from 'antd';
import { useState, type FC } from 'react';
import NewNoteForm from './NewNoteForm';
import styles from './NewNote.module.scss';

const NewNote: FC = () => {
   const [isActive, setIsActive] = useState<boolean>(false);

   return (
      <Flex vertical gap='large'>
         <Button color="default" variant="solid" onClick={() => setIsActive(!isActive)} className={styles.buttonDisplay}>{isActive ? 'Скрыть' : 'Добавить запись'}</Button>
         {isActive &&
            <NewNoteForm />
         }
      </Flex>
   )
}

export default NewNote;