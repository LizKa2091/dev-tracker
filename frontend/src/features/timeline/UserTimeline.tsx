import { useState, type FC } from 'react';
import { Flex, Segmented, Timeline } from 'antd';
import { useTimeline } from './useTimeline';
import type { ISegmentedOption, TimelineItem } from './timelineTypes';
import styles from './UserTimeline.module.scss';

const segmentedOptions: ISegmentedOption[] = [
   { label: 'День', value: 'day' },
   { label: 'Неделя', value: 'week' },
   { label: 'Месяц', value: 'month' },
   { label: 'Год', value: 'year' }
];

const UserTimeline: FC = () => {
   const [currSegment, setCurrSegment] = useState<string>('day');
   
   const timelineItems: TimelineItem[] = useTimeline(currSegment);

   const handleSegmentChange = (value: string): void => {
      setCurrSegment(value);
   };

   return (
      <Flex vertical gap='large'>
         <Flex vertical gap='small' className={styles.segmentedContainer}>
            <p>Показывать за:</p>
            <Segmented options={segmentedOptions} value={currSegment} onChange={handleSegmentChange} />
         </Flex>
         <Timeline items={timelineItems} className={styles.timeline}/>
      </Flex>
   )
}

export default UserTimeline;