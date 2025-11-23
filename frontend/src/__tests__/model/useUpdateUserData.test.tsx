import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUpdateUserData } from '../../features/settings/model/useUpdateUserData';
import { defaultTokenApiAxios } from "../../shared/api/axios";
import { describe, expect, test, vi } from "vitest";

vi.mock("../../shared/api/axios", () => ({
   defaultTokenApiAxios: {
      patch: vi.fn(),
   },
}));

describe('useUpdateUserData tests', () => {
   test('sends PATCH /me and calls invalidateQueries', async () => {
      const queryClient = new QueryClient();
      const spyInvalidate = vi.spyOn(queryClient, "invalidateQueries");

      defaultTokenApiAxios.patch.mockResolvedValue({
         data: {
         message: "updated",
         token: "newtoken",
         user: { id: 1, email: "a@b.com", name: "Bob" },
         },
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
         <QueryClientProvider client={queryClient}>
         {children}
         </QueryClientProvider>
      );

      const { result } = renderHook(() => useUpdateUserData("tok123"), {
         wrapper,
      });

      result.current.mutate({ name: "Bob", email: "a@b.com" });

      await waitFor(() => {
         expect(defaultTokenApiAxios.patch).toHaveBeenCalled();

         expect(spyInvalidate).toHaveBeenCalledWith({
            queryKey: ["userData", "tok123"],
         });
      });
   });
});
