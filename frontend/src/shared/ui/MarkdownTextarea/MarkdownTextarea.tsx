import { useEffect, useState, type FC, type Ref } from 'react';
import { Tooltip } from "antd";
import TextArea from "antd/es/input/TextArea";
import useDebounce from '../../lib/hooks/useDebounce';
import styles from './MarkdownTextarea.module.scss';

interface IMarkdownTextarea {
   value?: string;
   onChange: (value: string) => void;
   ref?: Ref<HTMLTextAreaElement>;
}

const MarkdownTextarea: FC<IMarkdownTextarea> = ({ value = '', onChange, ref }) => {
   const [userInput, setUserInput] = useState<string>(value);
   const [formattedInput, setFormattedInput] = useState<string>('');
   const [isFocused, setIsFocused] = useState<boolean>(false);

   const debouncedInput: string = useDebounce(userInput, 1000);

   useEffect(() => {
      onChange(debouncedInput);
      setFormattedInput(formatText(debouncedInput));
   }, [debouncedInput]);

   const formatText = (text: string): string => {
      const formattedText: string = text.replace(/```([\s\S]*?)```/g, (_, code) => {
         const lines = code.trimEnd().split('\n').map((line: unknown) => `<span>${line}</span>`).join('');
         
         return `<pre class="code-block"><code>${lines}</code></pre>`;
      }).replace(/`([^`]+)`/g, '<code>$1</code>');
      
      return formattedText;
   };

   return (
      <Tooltip title='Поддерживается форматирование кода. Просто оберните код в одиночные обратные кавычки (`) или 3 обратные кавычки (```)' placement="bottom">
         <div>
            {isFocused || !formattedInput.includes('<code') ? (
               <TextArea ref={ref} rows={4} value={isFocused ? userInput : formattedInput} onChange={((e) => setUserInput(e.target.value))} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} />
            ) : (
               <div dangerouslySetInnerHTML={{ __html: formattedInput }} onClick={() => setIsFocused(true)} className={styles.inActiveTextarea} />
            )}
            
         </div>
      </Tooltip>
   );
};

export default MarkdownTextarea;