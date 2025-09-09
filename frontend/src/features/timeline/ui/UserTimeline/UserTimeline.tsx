import { useEffect, useState, type FC } from 'react';
import { Flex, Segmented } from 'antd';
import { deleteNote } from '../../../notes/model/noteStorage';
import { filterByDate } from '../../model/filterByDate';
import type { ISegmentedOption } from '../../timelineTypes';
import type { INoteItem } from '../../../notes/noteTypes';
import NoteItem from '../../../../shared/note-item/ui/NoteItem/NoteItem';
import GithubTimeline from '../GithubTimeline/GithubTimeline';
import styles from './UserTimeline.module.scss';

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
         <h3>Недавно созданные задачи</h3>
         <Flex vertical gap='small' className={styles.segmentedContainer}>
            <p>Показывать за:</p>
            <Segmented options={segmentedOptions} value={currSegment} onChange={handleSegmentChange} />
         </Flex>
         <GithubTimeline />
         {timelineNotes.map((note: INoteItem) => 
            <NoteItem key={note.key} noteItemData={note} handleDeleteNote={handleDeleteNote} />
         )}
      </Flex>
   )
}

export default UserTimeline;