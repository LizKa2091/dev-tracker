import { useEffect, useState, type FC } from 'react';
import { Flex, Segmented } from 'antd';
import { filterByDate } from '../model/filterByDate';
import type { ISegmentedOption } from '../timelineTypes';
import styles from './UserTimeline.module.scss';
import { type INoteItem } from '../../notes/noteTypes';
import NoteItem from '../../../shared/note-item/ui/NoteItem/NoteItem';
import { deleteNote } from '../../notes/model/noteStorage';

const segmentedOptions: ISegmentedOption[] = [
   { label: 'День', value: 'day' },
   { label: 'Неделя', value: 'week' },
   { label: 'Месяц', value: 'month' },
   { label: 'Год', value: 'year' }
];

const UserTimeline: FC = () => {
   const [currSegment, setCurrSegment] = useState<string>('day');
   const [timelineNotes, setTimelineNotes] = useState<INoteItem[]>([]);
   
   useEffect(() => {
      setTimelineNotes(filterByDate(currSegment));
   }, [currSegment]);

   const handleDeleteNote = (noteKey: string): void => {
      const updatedNotes = deleteNote(noteKey);

      if (updatedNotes) {
         setTimelineNotes(updatedNotes);
      }
      setTimelineNotes(updatedNotes);
   }

   const handleSegmentChange = (value: string): void => {
      setCurrSegment(value);
   };

   return (
      <Flex vertical gap='large'>
         <Flex vertical gap='small' className={styles.segmentedContainer}>
            <p>Показывать за:</p>
            <Segmented options={segmentedOptions} value={currSegment} onChange={handleSegmentChange} />
         </Flex>
         {timelineNotes.map((note: INoteItem) => 
            <NoteItem key={note.key} noteItemData={note} handleDeleteNote={handleDeleteNote} />
         )}
      </Flex>
   )
}

export default UserTimeline;