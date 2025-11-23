import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUpdateAvatar } from '../../features/settings/model/useUpdateAvatar'; 
import { avatarAxios } from "../../shared/api/axios";
import { describe, expect, test, vi } from "vitest";

vi.mock('../../shared/api/axios', () => ({
   avatarAxios: {
      post: vi.fn(),
   },
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
   <QueryClientProvider client={new QueryClient()}>
      {children}
   </QueryClientProvider>
);

describe('useUpdateAvatar tests', () => {
   test('sends file to /me/avatar', async () => {
      avatarAxios.post.mockResolvedValue({
         data: { message: "ok", profilePic: "url" },
      });

      const file = new File(["abc"], "avatar.png");

      const { result } = renderHook(() => useUpdateAvatar("tokenX"), { wrapper });

      result.current.mutate({ file });

      await waitFor(() => {
         expect(avatarAxios.post).toHaveBeenCalledWith("/me/avatar", { file });
      });
   });
});
