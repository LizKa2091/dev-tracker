import dayjs from 'dayjs';
import { useEffect, useState, type FC } from 'react'
import type { INoteItem } from '../../../../features/notes/noteTypes';
import { Badge, Button, Card, Flex, Space, Tag, Grid } from 'antd';
import { CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import { changeNoteStatus } from '../../lib/changeNoteStatus';
import { useXpAction } from '../../model/useXpAction';
import { useHealthAction } from '../../model/useHealthAction';
import { useCompletedNoteNotification } from '../../../notifications/model/useCompletedNoteNotification';
import EditField from '../EditField/EditField';
import AuthExports from '../../../context/AuthContext';
import UndoProgress from '../UndoProgress/UndoProgress';
import styles from './NoteItem.module.scss';

const { useBreakpoint } = Grid;

interface INoteItemProps {
   noteItemData: INoteItem;
   handleDeleteNote: (noteKey: string) => void;
   disabled?: boolean;
};

const NoteItem: FC<INoteItemProps> = ({ noteItemData, handleDeleteNote, disabled }) => {
   const { token } = AuthExports.useAuthContext();
   const [currNote, setCurrNote] = useState<INoteItem>(noteItemData);
   const [isConfirmed, setIsConfirmed] = useState<boolean | null>(null);
   const [isCompleted, setIsCompleted] = useState<boolean>(noteItemData.status === 'completed');
   const [displayUndo, setDisplayUndo] = useState<boolean>(false);
   const screens = useBreakpoint();

   const isMobile = !screens.md;

   const { notifyCompletedNote } = useCompletedNoteNotification();

   const { addXp } = useXpAction(token);
   const { mutate: healthAction } = useHealthAction(token);

   useEffect(() => {
      if (isConfirmed) {
         handleDeleteNote(noteItemData.key);
      }
   }, [isConfirmed, handleDeleteNote, noteItemData.key]);

   const handleButtonDelete = (): void => {
      if (isConfirmed === null) {
         setIsConfirmed(false);
      }
      else if (isConfirmed === false) {
         setIsConfirmed(true);
      }
   };

   const handleChangeStatus = (key: string): void => {
      const newStatus = changeNoteStatus(key);

      if (newStatus === 'completed') {
         setIsCompleted(true);
         setDisplayUndo(true);
      }
      else {
         setIsCompleted(false);
      }
   };

   const handleCompleteUndo = () => {
      addXp();
      healthAction('add');
      notifyCompletedNote(currNote.title, currNote.dueToDate);
      
      setDisplayUndo(false);
   };

   const handleCancelUndo = () => {
      changeNoteStatus(currNote.key);
      setIsCompleted(false);
      setDisplayUndo(false);
   };

   const handleUpdateNote = (updatedNoteData: INoteItem): void => {
      setCurrNote(updatedNoteData);
   };

   return (
      <Card title={
         <Flex align={isMobile ? 'center' : 'flex-start'} vertical gap='small' wrap>
            <Flex align='center' gap='small' className={`${styles.cardTitle} ${styles.editableRow}`}>
               <p>{currNote.title}</p>
               <EditField 
                  value={currNote.title} 
                  field='title' 
                  note={currNote} 
                  onSave={handleUpdateNote} 
               />
            </Flex>
            {isMobile &&
               <Space className={styles.spaceExtra}>
                  <Tag color='blue'>{currNote.type}</Tag>

                  {isCompleted && displayUndo ? (
                     <UndoProgress duration={3000} onComplete={handleCompleteUndo} onCancel={handleCancelUndo} />
                  ) : (
                     isCompleted ? (
                        <p className={styles.completed}>
                           {isMobile ? <CheckOutlined /> : 'Выполнено'}
                        </p>
                  ) : (
                     <Button 
                        onClick={() => handleChangeStatus(currNote.key)} 
                        disabled={disabled}
                        icon={<CheckOutlined />}
                        className={styles.markButton}
                     >
                        <p>Пометить как выполненное</p>
                     </Button>
                  ))}

                  <Button 
                     danger 
                     onClick={handleButtonDelete} 
                     icon={<DeleteOutlined />} 
                     disabled={disabled} 
                     className={styles.delButton}
                  >
                     <p>{isConfirmed === null ? 'Удалить' : isConfirmed === false ? 'Вы уверены?' : ''}</p>
                  </Button>
               </Space>
            }
         </Flex>
         }
         extra={
            !isMobile && (
               <Space className={styles.spaceExtra}>
                  <Tag color='blue'>{currNote.type}</Tag>

                  {isCompleted && displayUndo ? (
                     <UndoProgress duration={3000} onComplete={handleCompleteUndo} onCancel={handleCancelUndo} />
                  ) : (
                     isCompleted ? (
                        <p className={styles.completed}>
                           {isMobile ? <CheckOutlined /> : 'Выполнено'}
                        </p>
                  ) : (
                     <Button 
                        onClick={() => handleChangeStatus(currNote.key)} 
                        disabled={disabled}
                        icon={<CheckOutlined />}
                        className={styles.markButton}
                     >
                        <p>Пометить как выполненное</p>
                     </Button>
                  ))}

                  <Button 
                     danger 
                     onClick={handleButtonDelete} 
                     icon={<DeleteOutlined />} 
                     disabled={disabled} 
                     className={styles.delButton}
                  >
                     <p>{isConfirmed === null ? 'Удалить' : isConfirmed === false ? 'Вы уверены?' : ''}</p>
                  </Button>
               </Space>
            )
         }
         className={currNote.tags?.length ? styles.card : ''}
      >
         <Space direction='vertical'>
            {currNote.formattedDescription ? (
               <Flex align='center' gap='small' wrap className={styles.editableRow}>
                  <div dangerouslySetInnerHTML={{ __html: currNote.formattedDescription }} />
                  <EditField 
                     value={currNote.description || ''} 
                     field='description' 
                     note={currNote} 
                     onSave={handleUpdateNote} 
                  />
               </Flex>
            ) : (
               <Flex align='center' gap='small' wrap className={styles.editableRow}>
                  <p className={styles.cardDetail}>{currNote.description || 'Нет описания'}</p>
                  <EditField 
                     value={currNote.description || ''} 
                     field='description' 
                     note={currNote} 
                     onSave={handleUpdateNote} 
                  />
               </Flex>
            )}
            <Flex align='center' gap='small' wrap className={styles.editableRow}>
               <p className={styles.cardDetail}>Выполнить до: {dayjs(currNote.dueToDate).format('DD.MM.YYYY')}</p>
               <EditField 
                  value={String(currNote.dueToDate)} 
                  field='dueToDate' 
                  note={currNote} 
                  onSave={handleUpdateNote} 
               />
            </Flex>
            <Space>
               {currNote.tags?.map(tag => 
                  <Badge 
                     key={tag.key} 
                     color={tag.color || '#888'} 
                     text={tag.value} 
                     className={styles.badge} 
                  />
               )}
            </Space>
         </Space>
      </Card>
   )
}

export default NoteItem