import { describe, test, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useHealthAction } from '../../shared/note-item/model/useHealthAction';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { defaultTokenApiAxios } from '../../shared/api/axios';

vi.mock('../../shared/api/axios', () => ({
   defaultTokenApiAxios: {
      post: vi.fn(),
   }
}));

const wrapper = ({ children }: any) => {
   const client = new QueryClient();

   return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

describe('useHealthAction tests', () => {
   beforeEach(() => vi.clearAllMocks());

   test('throws error if there is no token', async () => {
      const { result } = renderHook(() => useHealthAction(null), { wrapper });

      await expect(result.current.mutateAsync('add'))
         .rejects.toThrow('нет токена');
   });

   test('calls api and returns data', async () => {
      (defaultTokenApiAxios.post as any).mockResolvedValue({
         data: { message: 'ok', health: 10, delta: 1 }
      });

      const { result } = renderHook(() => useHealthAction('token123'), { wrapper });

      await result.current.mutateAsync('add');

      expect(defaultTokenApiAxios.post).toHaveBeenCalledWith('/health/add');
   });
});
