import { Button, Flex } from 'antd';
import { useState, type FC } from 'react';
import NewNoteForm from './NewNoteForm';
import styles from './NewNote.module.scss';
import RecentNotes from './RecentNotes';

const NewNote: FC = () => {
   const [isActive, setIsActive] = useState<boolean>(false);
   const [isNoteSaved, setIsNoteSaved] = useState<boolean>(false);

   return (
      <Flex vertical gap='large'>
         <Button color="default" variant="solid" onClick={() => setIsActive((prev) => !prev)} className={styles.buttonDisplay}>{isActive ? 'Скрыть' : 'Добавить запись'}</Button>
         <div className={`${styles.formContainer} ${isActive ? styles.active : styles.hidden}`}>
            <NewNoteForm isNoteSaved={isNoteSaved} setIsNoteSaved={setIsNoteSaved} />
         </div>
         <RecentNotes isNoteSaved={isNoteSaved} />
      </Flex>
   )
}

export default NewNote;