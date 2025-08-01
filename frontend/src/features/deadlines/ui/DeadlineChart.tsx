import { useEffect, useState, type FC } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { loadNotes } from '../../notes/model/noteStorage';
import { type INotesStorage } from '../../notes/model/constants';
import type { IChartDataItem } from '../model/deadlineNoteTypes';
import { formatNotes } from '../model/formatNotes';
import { Flex } from 'antd';
import styles from './DeadlineChart.module.scss';

const colors: string[] = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a4de6c'];

const DeadlineChart: FC = () => {
   const [chartData, setChartData] = useState<IChartDataItem[] | null>(null);
   const [types, setTypes] = useState<string[]>([]);

   useEffect(() => {
      const savedNotes: INotesStorage = loadNotes();

      if (savedNotes) {
         const formattedNotes = formatNotes(savedNotes.notes!);

         const seenTypes = new Set<string>();

         formattedNotes.forEach(item => {
            Object.keys(item).forEach(key => {
               if (key !== 'date') seenTypes.add(key);
            });
         });

         setChartData(formattedNotes);
         setTypes(Array.from(seenTypes));
      }
   }, [])

   if (!chartData) {
      return (
         <h3>У вас пока нет прошедших задач</h3>
      );
   }

   return (
      <Flex vertical gap='middle' className={styles.container}>
         <h3>Прошедшие дедлайны за 14 дней по категориям</h3>
         <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={chartData}>
               <CartesianGrid strokeDasharray='3 3' />
               <XAxis dataKey='date' />
               <YAxis allowDecimals={false} />
               <Tooltip
                  formatter={(value: number, name: string) => [`${value} задач`, name]}
                  labelFormatter={(label: string) => `Дата: ${label}`}
               />
               <Legend />
               {types.map((type, index)=> (
                  <Bar dataKey={type} key={type} stackId="a" fill={colors[index]} />
               ))}
            </BarChart>
         </ResponsiveContainer>
      </Flex>
   )
}

export default DeadlineChart;