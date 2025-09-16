import dayjs from 'dayjs';
import type { FC } from 'react';
import { Tooltip } from 'antd';
import styles from './ActivityCellItem.module.scss';

interface IActivityCellItemProps {
   activities: number;
   day: string;
   isHidden: boolean;
}

const ActivityCellItem: FC<IActivityCellItemProps> = ({ activities, day, isHidden }) => {
   return (
      <Tooltip title={isHidden ? '' : `${activities} выполненных заданий за ${dayjs(day).format('DD-MM-YYYY')}`}>
         <div className={`${styles.container} ${isHidden ? styles.hidden : ''}`}></div>
      </Tooltip>
   )
}

export default ActivityCellItem;