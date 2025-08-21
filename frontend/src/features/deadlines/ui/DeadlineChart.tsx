import { useEffect, useState, type FC } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { IChartDataItem } from '../model/deadlineNoteTypes';
import { Flex } from 'antd';
import styles from './DeadlineChart.module.scss';
import { getDeadlineChartData } from '../model/getDeadlineChartData';

const colors: string[] = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a4de6c'];

const DeadlineChart: FC = () => {
   const [savedChartData, setSavedChartData] = useState<IChartDataItem[] | null>(null);
   const [savedTypes, setSavedTypes] = useState<string[]>([]);

   useEffect(() => {
      const { chartData, types } = getDeadlineChartData();

      setSavedChartData(chartData);
      setSavedTypes(types);
   }, []);

   if (!savedChartData) {
      return (
         <h3>У вас пока нет прошедших задач</h3>
      );
   }

   return (
      <Flex vertical gap='middle' className={styles.container}>
         <h3>Прошедшие дедлайны за 14 дней по категориям</h3>
         <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={savedChartData}>
               <CartesianGrid strokeDasharray='3 3' />
               <XAxis dataKey='date' />
               <YAxis allowDecimals={false} />
               <Tooltip
                  formatter={(value: number, name: string) => [`${value} задач`, name]}
                  labelFormatter={(label: string) => `Дата: ${label}`}
               />
               <Legend />
               {savedTypes.map((type, index)=> (
                  <Bar dataKey={type} key={type} stackId="a" fill={colors[index]} />
               ))}
            </BarChart>
         </ResponsiveContainer>
      </Flex>
   )
}

export default DeadlineChart;