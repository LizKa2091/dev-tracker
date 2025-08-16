import { useEffect, useState, type FC } from 'react'
import AddCustomTag from './AddCustomTag';
import { Button, Flex, Tag } from 'antd';
import { type ITagItem } from '../../tagTypes';
import { deleteUserTag, loadUserTags } from '../../model/tagActions';
import styles from './TagsSettings.module.scss';

const TagsSettings: FC = () => {
   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
   const [savedTags, setSavedTags] = useState<ITagItem[]>();

   useEffect(() => {
      setSavedTags(loadUserTags());
   }, []);

   return (
      <Flex vertical gap='large' className={styles.container}>
         <h3>Тэги</h3>
         <Flex vertical gap='large' className={styles.innerContainer}>
            <Flex>
               {savedTags?.map(tag => (
                  <Tag key={tag.key} color={tag.color} closable onClose={() => deleteUserTag(tag.label)}>{tag.label}</Tag>
               ))}
            </Flex>
            <Button color="default" variant="solid" onClick={() => setIsModalOpen(true)}>Добавить новый тэг</Button>
            <AddCustomTag isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
         </Flex>
      </Flex>
   )
}

export default TagsSettings;