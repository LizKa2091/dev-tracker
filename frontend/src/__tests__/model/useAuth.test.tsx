import { renderHook, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRegisterUser, useLoginUser, useLogoutUser, useVerifyAuthStatus, useForgotPassword, useResetPassword }  from '../../features/auth/model/useAuth';
import { apiAxios, defaultTokenApiAxios } from '../../shared/api/axios';

vi.mock('../../shared/api/axios', () => ({
   apiAxios: {
      post: vi.fn(),
   },
   defaultTokenApiAxios: {
      post: vi.fn(),
      get: vi.fn(),
   },
}));

const createWrapper = () => {
   const queryClient = new QueryClient();

   return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
   );
};


describe('useAuth tests', () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   test('useRegisterUser calls /register and returns data', async () => {
      (apiAxios.post as any).mockResolvedValue({ data: { message: 'ok' } });

      const { result } = renderHook(() => useRegisterUser(), { wrapper: createWrapper() });

      await waitFor(() => result.current.mutateAsync({ email: 'e', password: 'p', name: 'n' }));

      expect(apiAxios.post).toHaveBeenCalledWith('/register', { email: 'e', password: 'p', name: 'n' });
      expect(result.current.isSuccess).toBe(true);
   });

   test('useLoginUser calls /login and returns token', async () => {
      (apiAxios.post as any).mockResolvedValue({ data: { token: 'mock-token' } });

      const { result } = renderHook(() => useLoginUser(), { wrapper: createWrapper() });

      const data = await result.current.mutateAsync({ email: 'a', password: 'b' });

      expect(apiAxios.post).toHaveBeenCalledWith('/login', { email: 'a', password: 'b' });
      expect(data.token).toBe('mock-token');
   });

   test('useLogoutUser calls /logout and returns message', async () => {
      (defaultTokenApiAxios.post as any).mockResolvedValue({ data: { message: 'logged out' } });

      const { result } = renderHook(() => useLogoutUser(), { wrapper: createWrapper() });

      const data = await result.current.mutateAsync();

      expect(defaultTokenApiAxios.post).toHaveBeenCalledWith('/logout');
      expect(data.message).toBe('logged out');
   });

   test('useVerifyAuthStatus calls /me if there is token', async () => {
      (defaultTokenApiAxios.get as any).mockResolvedValue({
         data: {
         message: 'verified',
         token: 'abc',
         user: { email: 't', name: 'test', xp: 0, profilePic: '' },
         difficulty: 'default',
         },
      });

      const { result } = renderHook(() => useVerifyAuthStatus('mock-token'), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(defaultTokenApiAxios.get).toHaveBeenCalledWith('/me');
      expect(result.current.data?.message).toBe('verified');
   });

   test('useForgotPassword calls /forgot-password', async () => {
      (apiAxios.post as any).mockResolvedValue({ data: { message: 'reset link sent' } });

      const { result } = renderHook(() => useForgotPassword(), { wrapper: createWrapper() });

      const data = await result.current.mutateAsync({ email: 'a@b.c' });

      expect(apiAxios.post).toHaveBeenCalledWith('/forgot-password', { email: 'a@b.c' });
      expect(data.message).toBe('reset link sent');
   });

   test('useResetPassword calls /reset-password', async () => {
      (apiAxios.post as any).mockResolvedValue({ data: { message: 'password updated' } });

      const { result } = renderHook(() => useResetPassword(), { wrapper: createWrapper() });

      const data = await result.current.mutateAsync({ token: 't', newPassword: 'p' });

      expect(apiAxios.post).toHaveBeenCalledWith('/reset-password', { token: 't', newPassword: 'p' });
      expect(data.message).toBe('password updated');
   });

   test('throws errors on failed requests', async () => {
      (apiAxios.post as any).mockRejectedValue(new Error('server error'));

      const { result } = renderHook(() => useLoginUser(), { wrapper: createWrapper() });

      await expect(result.current.mutateAsync({ email: 'x', password: 'y' })).rejects.toThrow('server error');
   });
});
