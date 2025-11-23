import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useChangePassword } from '../../features/settings/model/useChangePassword';
import { defaultTokenApiAxios } from "../../shared/api/axios";
import { describe, expect, test, vi } from "vitest";

vi.mock("../../shared/api/axios", () => ({
   defaultTokenApiAxios: {
      post: vi.fn(),
   },
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
   <QueryClientProvider client={new QueryClient()}>
      {children}
   </QueryClientProvider>
);

describe('useChangePassword tests', () => {
   test('successfully sends POST /me/change-password', async () => {
      defaultTokenApiAxios.post.mockResolvedValue({
         data: { message: "ok" },
      });

      const { result } = renderHook(() => useChangePassword("token123"), {
         wrapper,
      });

      result.current.mutate({ currPass: "old", newPass: "new" });

      await waitFor(() => {
         expect(defaultTokenApiAxios.post).toHaveBeenCalledWith(
            "/me/change-password",
            { oldPassword: "old", newPassword: "new" }
         );
      });
   });
});
