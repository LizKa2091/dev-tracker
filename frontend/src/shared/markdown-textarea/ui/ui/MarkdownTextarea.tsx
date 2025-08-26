import { useEffect, useState, type FC, type Ref } from 'react';
import { Tooltip } from "antd";
import TextArea from "antd/es/input/TextArea";
import useDebounce from '../../../lib/hooks/useDebounce';
import { formatMarkdownDesc } from '../../../lib/markdown/formatMarkdownDesc';
import styles from './MarkdownTextarea.module.scss';

interface IMarkdownTextarea {
   value?: string;
   onChange: (value: string) => void;
   ref?: Ref<HTMLTextAreaElement>;
   onFormattedChange?: (formatted: string) => void;
   disabled?: boolean;
}

const MarkdownTextarea: FC<IMarkdownTextarea> = ({ value = '', onChange, ref, onFormattedChange, disabled }) => {
   const [userInput, setUserInput] = useState<string>(value);
   const [formattedInput, setFormattedInput] = useState<string>('');
   const [isFocused, setIsFocused] = useState<boolean>(false);

   const debouncedInput: string = useDebounce(userInput, 300);

   useEffect(() => {
      onChange(debouncedInput);
      
      const formattedText: string = formatMarkdownDesc(debouncedInput);
      setFormattedInput(formattedText);

      if (onFormattedChange) {
         if (formattedInput.includes('<code')) onFormattedChange(formattedText);
         else onFormattedChange('');
      }
   }, [debouncedInput, formattedInput, onChange, onFormattedChange]);

   return (
      <Tooltip title='Поддерживается форматирование кода. Просто оберните код в одиночные обратные кавычки (`) или 3 обратные кавычки (```)' placement="bottom">
         <div>
            {isFocused || !formattedInput.includes('<code') ? (
               <TextArea
                  name='description'
                  ref={ref}
                  rows={4}
                  value={isFocused ? userInput : formattedInput}
                  onChange={((e) => setUserInput(e.target.value))}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  disabled={disabled}
               />
            ) : (
               <div dangerouslySetInnerHTML={{ __html: formattedInput }} onClick={() => setIsFocused(true)} className={styles.inActiveTextarea} />
            )}
            
         </div>
      </Tooltip>
   );
};

export default MarkdownTextarea;