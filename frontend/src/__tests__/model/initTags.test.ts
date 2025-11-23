import { describe, test, expect, beforeEach } from 'vitest';
import { initTags } from './../../features/notes/model/initTags';
import { tagOptions } from '../../features/notes/model/constants';

describe('initTags tests', () => {
   beforeEach(() => {
      localStorage.clear();
   });

   test('saved tags if there is no any in localStorage', () => {
      expect(localStorage.getItem('userTags')).toBeNull();

      initTags();

      expect(JSON.parse(localStorage.getItem('userTags')!)).toEqual(tagOptions);
   });

   test('does nothing if there are already saved tags', () => {
      localStorage.setItem('userTags', JSON.stringify(['X']));

      initTags();

      expect(JSON.parse(localStorage.getItem('userTags')!)).toEqual(['X']);
   });
});
