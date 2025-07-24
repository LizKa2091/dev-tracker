import { useEffect, useState, type FC, type Ref } from 'react';
import { Tooltip } from "antd";
import TextArea from "antd/es/input/TextArea";
import useDebounce from '../../lib/hooks/useDebounce';

interface IMarkdownTextarea {
   value?: string;
   onChange: (value: string) => void;
   ref?: Ref<HTMLTextAreaElement>;
}

const MarkdownTextarea: FC<IMarkdownTextarea> = ({ value = '', onChange, ref }) => {
   const [userInput, setUserInput] = useState<string>(value);

   const debouncedInput: string = useDebounce(userInput, 1000);

   useEffect(() => {
      onChange(debouncedInput);
   }, [debouncedInput]);


   return (
      <Tooltip title='Поддерживается форматирование кода. Просто оберните код в одиночные обратные кавычки (`) или 3 обратные кавычки (```)' placement="bottom">
         <div>
            <TextArea ref={ref} rows={4} value={userInput} onChange={((e) => setUserInput(e.target.value))} />
         </div>
      </Tooltip>
   );
};

export default MarkdownTextarea;