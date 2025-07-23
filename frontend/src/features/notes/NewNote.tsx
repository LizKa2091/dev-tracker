import { Button, Flex } from 'antd';
import { useState, type FC } from 'react';
import NewNoteForm from './NewNoteForm';
import styles from './NewNote.module.scss';
// import RecentNotes from './RecentNotes';

const NewNote: FC = () => {
   const [isActive, setIsActive] = useState<boolean>(false);
   const [isNoteSaved, setIsNoteSaved] = useState<boolean>(false);

   return (
      <Flex vertical gap='large'>
         <Button color="default" variant="solid" onClick={() => setIsActive(!isActive)} className={styles.buttonDisplay}>{isActive ? 'Скрыть' : 'Добавить запись'}</Button>
         {isActive &&
            <NewNoteForm isNoteSaved={isNoteSaved} setIsNoteSaved={setIsNoteSaved} />
         }
         {/* <RecentNotes isNoteSaved={isNoteSaved} /> */}
      </Flex>
   )
}

export default NewNote;