import type { FC } from 'react';
import { Card, Flex } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import { filterCommitsByDate } from '../../model/filterCommitsByDate';
import styles from './GithubTimeline.module.scss';

interface IGithubTimelineProps {
   segment: string;
};

const GithubTimeline: FC<IGithubTimelineProps> = ({ segment }) => {
   const repsToDisplay = filterCommitsByDate(segment);
      
   if (!repsToDisplay.length) {
      return null;
   }

   return (
      repsToDisplay.map(repository =>
         repository.commits.map(commit => 
            <Card title={
                  <Flex gap='middle' className={styles.cardTitle}><GithubOutlined />Коммит в репозитории: {repository.repositoryTitle}</Flex>
               }
               extra={commit.author.date.split('T')[0]}
               className={styles.card}
            >
               {commit.message}
            </Card>
         )
      )
   )
}

export default GithubTimeline