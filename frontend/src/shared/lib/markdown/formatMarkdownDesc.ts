export const formatMarkdownDesc = (text: string): string => {
   const formattedText: string = text.replace(/```([\s\S]*?)```/g, (_, code) => {
      const lines = code.trimEnd().split('\n').map((line: unknown) => `<span>${line}</span>`).join('');
      
      return `<pre class="code-block"><code>${lines}</code></pre>`;
   }).replace(/`([^`]+)`/g, '<code>$1</code>');
   
   return formattedText;
};