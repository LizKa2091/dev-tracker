import { Button, Flex } from 'antd';
import { useState, type FC } from 'react';
import NewNoteForm from '../NewNoteForm/NewNoteForm';
import RecentNotes from '../RecentNotes/RecentNotes';
import styles from './NewNote.module.scss';

const NewNote: FC = () => {
   const [isActive, setIsActive] = useState<boolean>(false);
   const [isNoteSaved, setIsNoteSaved] = useState<boolean>(false);

   return (
      <Flex vertical gap='large'>
         <Button color="default" variant="solid" onClick={() => setIsActive((prev) => !prev)} className={styles.buttonDisplay}>{isActive ? 'Скрыть' : 'Добавить запись'}</Button>
         <Flex className={`${styles.formContainer} ${isActive ? styles.active : styles.hidden}`}>
            <NewNoteForm isNoteSaved={isNoteSaved} setIsNoteSaved={setIsNoteSaved} />
         </Flex>
         <RecentNotes isNoteSaved={isNoteSaved} />
      </Flex>
   )
}

export default NewNote;