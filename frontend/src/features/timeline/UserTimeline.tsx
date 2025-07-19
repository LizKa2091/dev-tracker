import type { FC } from 'react';
import { Timeline } from 'antd';
import { useTimeline } from './useTimeline';
import type { ITimelineItem } from './timelineTypes';
import styles from './UserTimeline.module.scss';

const UserTimeline: FC = () => {
   const timelineItems: ITimelineItem[] = useTimeline();

   return (
      <Timeline items={timelineItems} className={styles.timeline}/>
   )
}

export default UserTimeline;