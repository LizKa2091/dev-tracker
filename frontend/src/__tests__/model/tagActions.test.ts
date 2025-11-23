import { describe, test, expect, beforeEach } from 'vitest';
import { loadUserTags, updateUserTags, deleteUserTag } from '../../features/settings/model/tagActions';

describe('tagActions tests', () => {
   beforeEach(() => {
      localStorage.clear();
   });

   test('loadUserTags возвращает пустой массив если нет данных', () => {
      expect(loadUserTags()).toEqual([]);
   });

   test('updateUserTags добавляет новый тег', () => {
      const tags = updateUserTags('Tag1', '#fff');
      expect(tags).toHaveLength(1);
      expect(tags[0].value).toBe('Tag1');
   });

   test('updateUserTags не дублирует существующий тег', () => {
      updateUserTags('Tag1', '#fff');
      const tags = updateUserTags('Tag1', '#fff');
      expect(tags).toHaveLength(1);
   });

   test('deleteUserTag удаляет тег', () => {
      updateUserTags('Tag1', '#fff');
      const tags = deleteUserTag('Tag1');
      expect(tags).toHaveLength(0);
   });
});
