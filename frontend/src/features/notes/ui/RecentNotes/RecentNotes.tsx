import { Button, Flex, Space } from 'antd';
import { useEffect, useState, type FC } from 'react'
import { type INoteItem } from '../../noteTypes';
import { deleteNote, loadRecentNotes } from '../../model/noteStorage';
import NoteItem from '../../../../shared/note-item/ui/NoteItem/NoteItem';

interface IRecentNotesProps {
   isNoteSaved: boolean;
}

const RecentNotes: FC<IRecentNotesProps> = ({ isNoteSaved }) => {
   const [itemsAmount, setItemsAmount] = useState<number>(5);
   const [notesData, setNotesData] = useState<INoteItem[] | null>(null);
   const [notesLimit, setNotesLimit] = useState<number>(0);

   useEffect(() => {
      const notesResponse = loadRecentNotes(itemsAmount);
      
      setNotesData(notesResponse.notes);
      setNotesLimit(notesResponse.limit);
   }, [itemsAmount, isNoteSaved]);

   const handleDeleteNote = (noteKey: string): void => {
      const updatedNotes = deleteNote(noteKey);

      if (updatedNotes) {
         setNotesData(updatedNotes);
      }
      setNotesData(updatedNotes);
   }

   if (!notesData || notesData.length === 0) {
      return <span>У вас нет записей. Создайте первую запись</span>
   }

   return (
      <Flex vertical gap='middle'>
         <h3>Последние записи</h3>
         <Space direction='vertical' size='middle'>
            {notesData.map((item: INoteItem) => 
               <NoteItem noteItemData={item} key={item.key} handleDeleteNote={handleDeleteNote} />
            )}
         </Space>
         {notesLimit > itemsAmount &&
            <Button color="default" variant="solid" onClick={() => setItemsAmount(prevAmount => prevAmount + 5)}>Показать ещё</Button>
         }
      </Flex>
   )
}

export default RecentNotes;