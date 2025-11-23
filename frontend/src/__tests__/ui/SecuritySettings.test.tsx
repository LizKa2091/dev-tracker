import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import AuthExports from "../../shared/context/AuthContext";
import { useChangePassword } from "../../features/settings/model/useChangePassword";
import SecuritySettings from "../../features/settings/ui/SecuritySettings/SecuritySettings";

vi.mock("../../shared/context/AuthContext", () => ({
   default: {
      useAuthContext: vi.fn(),
   },
}));

vi.mock("../../features/settings/model/useChangePassword", () => ({
   useChangePassword: vi.fn(),
}));

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
   const actual = await vi.importActual<any>("react-router-dom");
   return {
      ...actual,
      useNavigate: () => mockNavigate,
   };
});

describe("SecuritySettings tests", () => {
   const mockLogout = vi.fn();

   beforeEach(() => {
      vi.clearAllMocks();
      AuthExports.useAuthContext.mockReturnValue({
         token: "TOKEN",
         logout: mockLogout,
      });
   });

   const renderComp = () =>
      render(
         <MemoryRouter>
         <SecuritySettings />
         </MemoryRouter>
      );

   test("displays error if data is empty", async () => {
      useChangePassword.mockReturnValue({
         mutateAsync: vi.fn(),
         isPending: false,
      });

      renderComp();

      fireEvent.click(screen.getByRole("button", { name: 'Сменить пароль' }));

      expect(await screen.findAllByText('Обязательное поле')).toHaveLength(2);
   });

   test("successfully changes password", async () => {
      useChangePassword.mockReturnValue({
         mutateAsync: vi.fn(() =>
         Promise.resolve({ message: "Пароль изменён" })
         ),
         isPending: false,
      });

      renderComp();

      const oldPassInput = document.querySelector(
         'input[name="currPass"]'
      ) as HTMLInputElement;
      const newPassInput = document.querySelector(
         'input[name="newPass"]'
      ) as HTMLInputElement;

      fireEvent.change(oldPassInput, { target: { value: "123456" } });
      fireEvent.change(newPassInput, { target: { value: "abcdef" } });

      fireEvent.click(screen.getByRole("button", { name: 'Сменить пароль' }));

      expect(await screen.findByText('Пароль изменён')).toBeInTheDocument();
   });

   test("error on bad password change", async () => {
      useChangePassword.mockReturnValue({
         mutateAsync: vi.fn(() =>
         Promise.reject(new Error("Неверный пароль"))
         ),
         isPending: false,
      });

      renderComp();

      const oldPassInput = document.querySelector(
         'input[name="currPass"]'
      ) as HTMLInputElement;
      const newPassInput = document.querySelector(
         'input[name="newPass"]'
      ) as HTMLInputElement;

      fireEvent.change(oldPassInput, { target: { value: "123456" } });
      fireEvent.change(newPassInput, { target: { value: "abcdef" } });

      fireEvent.click(screen.getByRole("button", { name: 'Сменить пароль' }));

      expect(await screen.findByText('Неверный пароль')).toBeInTheDocument();
   });

   test('logout callsa logout and navigate("/")', () => {
      useChangePassword.mockReturnValue({
         mutateAsync: vi.fn(),
         isPending: false,
      });

      renderComp();

      fireEvent.click(screen.getByRole("button", { name: 'Выйти' }));

      expect(mockLogout).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith("/");
   });
});
