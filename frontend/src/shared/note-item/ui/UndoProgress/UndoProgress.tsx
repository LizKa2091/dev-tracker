import { useEffect, useState, type FC } from 'react';
import { Flex, Progress } from 'antd';
import styles from './UndoProgress.module.scss';

interface IUndoProgressProps {
   duration: number;
   onComplete: () => void;
   onCancel: () => void;
};

const UndoProgress: FC<IUndoProgressProps> = ({ duration, onComplete, onCancel }) => {
   const [currPercent, setCurrPercent] = useState<number>(0);

   useEffect(() => {
      const startTime = Date.now();

      const timerId = setInterval(() => {
         const progress: number = Math.min((Date.now() - startTime) / duration * 100, 100);

         setCurrPercent(progress);

         if (progress >= 100) {
            clearInterval(timerId);
            onComplete();
         }
      }, 50);

      return () => clearInterval(timerId);
   }, [duration, onComplete])
   
   return (
      <Flex vertical justify='center' align='center' onClick={onCancel} className={styles.undo}>
         <p>Отменить</p>
         <Progress percent={currPercent} showInfo={false} size='small' />
      </Flex>
   )
}

export default UndoProgress;