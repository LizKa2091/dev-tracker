import type { FC } from "react";
import Router from "./Router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthExports from "../shared/context/AuthContext";
import NotificationsExports from "../shared/notifications/model/NotificationsContext";

const { AuthContextProvider } = AuthExports;
const { NotificationsContextProvider } = NotificationsExports;

const queryClient = new QueryClient();

const App: FC = () => {
   return (
      <QueryClientProvider client={queryClient}>
         <AuthContextProvider>
            <NotificationsContextProvider>
               <Router />
            </NotificationsContextProvider>
         </AuthContextProvider>
      </QueryClientProvider>
   )
}

export default App;