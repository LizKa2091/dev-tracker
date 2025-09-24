import dayjs from 'dayjs';
import type { FC } from 'react';
import { Flex, Grid } from 'antd';
import { useCellsData } from '../../model/useCellsData';
import { useCellsGrid } from '../../model/useCellsGrid';
import ActivityCellItem from '../ActivityCellItem/ActivityCellItem';
import { weekDays } from '../../lib/weekDays';
import styles from './ActivityCells.module.scss';

const { useBreakpoint } = Grid;

const ActivityCells: FC = () => {
   const { cellItems } = useCellsData();
   const { weeks, maxActivities } = useCellsGrid(cellItems);
   const screens = useBreakpoint();
   const isMobile = !screens.md;

   return (
      <Flex vertical gap='large' className={styles.mainContainer}>
         <h3>За {dayjs().year()} год</h3>
         <p>{cellItems.reduce((acc, item) => acc + item.activities, 0)} выполненных заданий</p>

         {!isMobile ? (
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
         ) : (
            <Flex vertical gap='small' className={styles.calendarMobile}>
               <Flex justify='space-between' gap='small'>
                  {weekDays.map(day => (
                     <div key={day} className={styles.weekLabel}>{day}</div>
                  ))}
               </Flex>
               <Flex gap='small' justify='space-between'>
                  {weekDays.map((_, dayIndex) => (
                     <Flex key={dayIndex} vertical gap="small" className={styles.dayColumn}>
                        {weeks.map((week, wi) => {
                           const item = week.days[dayIndex];

                           return item ? (
                              <ActivityCellItem
                                 key={item.day} 
                                 day={item.day} 
                                 isHidden={item.isHidden} 
                                 activities={item.activities} 
                                 maxActivities={maxActivities || 0}
                              />
                           ) : (
                              <div key={wi + '-' + dayIndex} className={styles.emptyCell} />
                           )
                        })}
                     </Flex>
                  ))}
               </Flex>
            </Flex>
         )}

      </Flex>
   )
}

export default ActivityCells