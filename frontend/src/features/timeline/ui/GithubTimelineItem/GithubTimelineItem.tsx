import { GithubOutlined } from '@ant-design/icons';
import { Card, Flex } from 'antd';
import type { FC } from 'react';
import styles from './GithubTimelineItem.module.scss';

interface IGithubTimelineItemProps {
   repName: string;
   message: string;
   date: string;
};

const GithubTimelineItem: FC<IGithubTimelineItemProps> = ({ repName, message, date }) => {

   return (
      <Card title={
            <Flex gap='middle' className={styles.cardTitle}><GithubOutlined />Коммит в репозитории: {repName}</Flex>
         }
         extra={date.split('T')[0]}
         className={styles.card}
      >
         {message}
      </Card>
   )
}

export default GithubTimelineItem;