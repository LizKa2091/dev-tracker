import { Select, Tag } from 'antd';
import type { FC } from 'react';
import type { ITagItem } from '../../../settings/tagTypes';

interface ITagSelectProps {
   value?: ITagItem[];
   onChange?: (value: ITagItem[]) => void;
   userTags?: ITagItem[];
};

const TagSelect: FC<ITagSelectProps> = ({ value = [], onChange, userTags = [] }) => {
   const selectedValues = value.map(tag => tag.value);

   return (
      <Select mode='tags'
         value={selectedValues}
         options={userTags?.map(tag => ({ label: tag.label, value: tag.value })) || []}
         onChange={(selected: string[]) => {
            const updatedTags: ITagItem[] = selected.map(val =>
               userTags?.find(tag => tag.value === val) || { value: val, label: val, color: '#888', key: val }
            );
            onChange?.(updatedTags);
         }}
         tagRender={({ label, value, closable, onClose }) => {
            const color = userTags?.find(tag => tag.value === value)?.color || '#888';
            return (
               <Tag color={color} closable={closable} onClose={onClose}>
                  {label}
               </Tag>
            );
         }}
      />
   );
}

export default TagSelect;