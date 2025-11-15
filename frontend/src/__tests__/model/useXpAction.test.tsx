import { describe, test, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useXpAction } from '../../shared/note-item/model/useXpAction';

global.fetch = vi.fn();

const wrapper = ({ children }: any) => {
   const client = new QueryClient();

   return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

describe('useXpAction tests', () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   test('error if there is no token', async () => {
      const { result } = renderHook(() => useXpAction(null), { wrapper });

      await expect(result.current.addXp()).rejects.toThrow('не предоставлен токен');
   });

   test('successfully calls addXp', async () => {
      (fetch as any).mockResolvedValue({
         ok: true,
         json: async () => ({ xp: 10 })
      });

      const { result } = renderHook(() => useXpAction('token123'), { wrapper });

      await result.current.addXp();

      expect(fetch).toHaveBeenCalledWith(
         'http://localhost:5001/xp/add',
         expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({ authorization: 'Bearer token123' })
         })
      );
   });

   test('error if server returns error', async () => {
      (fetch as any).mockResolvedValue({
         ok: false,
         json: async () => ({ message: 'Ошибка XP' })
      });

      const { result } = renderHook(() => useXpAction('token123'), { wrapper });

      await expect(result.current.addXp()).rejects.toThrow('Ошибка XP');
   });
});
