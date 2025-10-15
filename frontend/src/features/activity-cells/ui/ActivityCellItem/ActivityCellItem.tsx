import dayjs from 'dayjs';
import type { FC } from 'react';
import { Tooltip } from 'antd';
import { getActivityLevel } from '../../lib/getActivityLevel';
import styles from './ActivityCellItem.module.scss';

interface IActivityCellItemProps {
   day: string;
   isHidden: boolean;
   activities: number;
   maxActivities: number;
}

const ActivityCellItem: FC<IActivityCellItemProps> = ({
   day,
   isHidden,
   activities,
   maxActivities
}) => {
   const level = getActivityLevel(activities, maxActivities);

   return (
      <Tooltip
         title={
            isHidden
               ? ''
               : `${activities} выполненных заданий за ${dayjs(day).format(
                    'DD-MM-YYYY'
                 )}`
         }
      >
         <div
            data-testid="activity-cell"
            className={`${styles.container} ${isHidden ? styles.hidden : ''} ${
               !isHidden ? styles[`level${level}`] : ''
            }`}
         ></div>
      </Tooltip>
   );
};

export default ActivityCellItem;
