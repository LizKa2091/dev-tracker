import type { FC } from "react";
import Router from "./Router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthExports from "../shared/context/AuthContext";

const { AuthContextProvider } = AuthExports;

const queryClient = new QueryClient();

const App: FC = () => {
   return (
      <QueryClientProvider client={queryClient}>
         <AuthContextProvider>
            <Router />
         </AuthContextProvider>
      </QueryClientProvider>
   )
}

export default App;