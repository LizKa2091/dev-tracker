import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUpdateDifficulty } from '../../features/settings/model/useUpdateDifficulty';
import { defaultTokenApiAxios } from "../../shared/api/axios";
import { describe, expect, test, vi } from "vitest";

vi.mock("../../shared/api/axios", () => ({
   defaultTokenApiAxios: {
      patch: vi.fn(),
   },
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
   <QueryClientProvider client={new QueryClient()}>
      {children}
   </QueryClientProvider>
);

describe('useUpdateDifficulty tests', () => {
   test('sends PATCH /me/difficulty with difficulty', async () => {
      defaultTokenApiAxios.patch.mockResolvedValue({
         data: { message: "ok", difficulty: "hard" },
      });

      const { result } = renderHook(() => useUpdateDifficulty("tokenZ"), {
         wrapper,
      });

      result.current.mutate({ difficulty: "hard" });

      await waitFor(() => {
         expect(defaultTokenApiAxios.patch).toHaveBeenCalledWith(
            "/me/difficulty",
            "hard"
         );
      });
   });
});
