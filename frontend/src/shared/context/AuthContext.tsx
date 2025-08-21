import { createContext, useContext, useEffect, useState, type FC, type ReactNode } from 'react';
import { useRegisterUser, useLoginUser, useLogoutUser, useVerifyAuthStatus } from '../../features/auth/model/useAuth';

interface IAuthContext {
   isAuthed: boolean | null;
   token: string | null;
   register: (email: string, password: string, name: string) => Promise<IRequestResponseMessage>;
   login: (email: string, password: string) => Promise<ILoginRequestResponse>;
   logout: (token: string) => Promise<IRequestResponseMessage | Error>;
   checkLoginStatus: (token: string) => void;
};

interface IAuthProvider {
   children: ReactNode;
}

interface IRequestResponseMessage {
   message: string;
};

interface ILoginRequestResponse {
   token?: string;
   message?: string;
};

const AuthContext  = createContext<IAuthContext | undefined>(undefined);

const AuthContextProvider: FC<IAuthProvider> = ({ children })=> {
   const [isAuthed, setIsAuthed] = useState<boolean | null>(null);
   const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

   const { mutateAsync: registerMutate } = useRegisterUser();
   const { mutateAsync: loginMutate } = useLoginUser();
   const { mutateAsync: logoutMutate } = useLogoutUser();
   const { refetch: refecthAuth } = useVerifyAuthStatus(token);

   useEffect(() => {
      if (token) {
         checkLoginStatus(token);
      }
   }, [token]);

   const clearAuthData = (): void => {
      localStorage.removeItem('token');
      localStorage.removeItem('notes');
      localStorage.removeItem('userTags');
      setToken(null);
      setIsAuthed(false);
   };

   const register = async (email: string, password: string, name: string): Promise<IRequestResponseMessage> => {
      try {
         const result = await registerMutate({ email, password, name });
      
         return result;
      }
      catch (error) {
         return error as Error;
      }
   };

   const login = async (email: string, password: string): Promise<ILoginRequestResponse> => {
      try {
         const result = await loginMutate({ email, password });
      
         localStorage.setItem('token', result.token);
         setToken(result.token);
         setIsAuthed(true);

         return result;
      }
      catch (error) {
         return error as Error;
      }
   };

   const logout = async (token: string): Promise<IRequestResponseMessage | Error> => {
      if (token) {
         try {
            const response = await logoutMutate({ token });

            return response;
         }
         catch (error) {
            return error as Error;
         }
         finally {
            clearAuthData();
         }
      }
      throw new Error('нет токена');
   };

   const checkLoginStatus = async (token: string) => {
      if (!token) {
         clearAuthData();

         throw new Error('нет токена');
      }
      
      const result = await refecthAuth();

      if (result.error) {
         clearAuthData();
         
         return result.error;
      }

      setIsAuthed(true);
      return result.data;
   };

   return (
      <AuthContext.Provider value={{ isAuthed, token, register, login, logout, checkLoginStatus }}>
         {children}
      </AuthContext.Provider>
   );
};

const useAuthContext = () => {
   const context = useContext(AuthContext);

   if (!context) throw new Error('AuthContext должен использоваться внутри AuthContextProvider');

   return context;
}

const AuthExports = { AuthContext, AuthContextProvider, useAuthContext };

export default AuthExports;