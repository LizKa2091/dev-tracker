import { describe, test, expect, beforeEach } from 'vitest';
import { loadShownDeadlines, saveShownDeadlines } from './../../features/missed-deadline/model/loadShownDeadlines';

describe('shownDeadlines tests', () => {
   beforeEach(() => {
      localStorage.clear();
   });

   test('loadShownDeadlines returns empty set if there is no data', () => {
      const result = loadShownDeadlines();
      expect(result instanceof Set).toBe(true);
      expect(result.size).toBe(0);
   });

   test('loadShownDeadlines returns set with values', () => {
      localStorage.setItem('shownDeadlines', JSON.stringify(['a', 'b']));
      const result = loadShownDeadlines();

      expect(result instanceof Set).toBe(true);
      expect(result.has('a')).toBe(true);
      expect(result.has('b')).toBe(true);
   });

   test('saveShownDeadlines saves set to localStorage', () => {
      const set = new Set(['x', 'y']);
      saveShownDeadlines(set);

      const saved = JSON.parse(localStorage.getItem('shownDeadlines')!);
      expect(saved).toEqual(['x', 'y']);
   });
});
