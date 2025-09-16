import type { FC } from 'react';
import { Flex } from 'antd';
import { useCellsData } from '../../model/useCellsData';
import { useCellsGrid } from '../../model/useCellsGrid';
import ActivityCellItem from '../ActivityCellItem/ActivityCellItem';
import { weekDays } from '../../lib/weekDays';
import styles from './ActivityCells.module.scss';

const ActivityCells: FC = () => {
   const { cellItems } = useCellsData();
   const { weeks, maxActivities } = useCellsGrid(cellItems);

   return (
      <Flex vertical gap='large' className={styles.mainContainer}>
         <h3>2025</h3>
         <p>{cellItems.reduce((acc, item) => acc + item.activities, 0)} выполненных заданий</p>
         <Flex gap='small' className={styles.calendar}>
            <Flex vertical>
               {weekDays.map(day => (
                  <Flex key={day} className={styles.weekLabel}>
                     {day}
                  </Flex>
               ))}
            </Flex>
            <Flex gap='small'>
               {weeks.map((week, wi) => (
                  <Flex key={wi} vertical gap="small" className={styles.weekColumn}>
                     {week.days.map((item, di) =>
                        item ? (
                           <ActivityCellItem 
                              key={item.day} 
                              day={item.day} 
                              isHidden={item.isHidden} 
                              activities={item.activities} 
                              maxActivities={maxActivities || 0} 
                           />
                        ) : (
                           <div key={di} className={styles.emptyCell} />
                        )
                     )}
                  </Flex>
               ))}
            </Flex>
         </Flex>
      </Flex>
   )
}

export default ActivityCells;