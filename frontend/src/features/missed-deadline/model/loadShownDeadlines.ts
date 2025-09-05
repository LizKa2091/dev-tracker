export const loadShownDeadlines = (): Set<string> => {
   const savedShownDeadlines = localStorage.getItem('shownDeadlines');

   return savedShownDeadlines ? new Set(JSON.parse(savedShownDeadlines)) : new Set();
};

export const saveShownDeadlines = (deadlines: Set<string>): void => {
   localStorage.setItem('shownDeadlines', JSON.stringify([...deadlines]));
};