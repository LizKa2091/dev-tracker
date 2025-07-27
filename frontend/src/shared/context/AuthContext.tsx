import { createContext, useContext, useEffect, useState, type FC, type ReactNode } from 'react';
import { useRegisterUser, useLoginUser, useLogoutUser, useVerifyAuthStatus } from '../../features/auth/useAuth';

interface IAuthContext {
   isAuthed: boolean | null;
   register: (email: string, password: string, name: string) => void;
   login: (email: string, password: string) => void;
   logout: (token: string) => void;
   checkLoginStatus: (token: string) => void;
};

interface IAuthProvider {
   children: ReactNode;
}

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

   const register = async (email: string, password: string, name: string): Promise<void> => {
      await registerMutate({ email, password, name });
   };

   const login = async (email: string, password: string): Promise<void> => {
      const result = await loginMutate({ email, password });

      localStorage.setItem('token', result.token);
      setToken(result.token);
      setIsAuthed(true);
   };

   const logout = async (token: string): Promise<void> => {
      if (token) {
         await logoutMutate({ token });
         localStorage.removeItem('token');
         setToken(null);
         setIsAuthed(false);
      }
   };

   const checkLoginStatus = async (token: string): Promise<void> => {
      if (!token) {
         setIsAuthed(false);
         return;
      }
      
      try {
         await refecthAuth();
         setIsAuthed(true);
      }
      catch {
         setIsAuthed(false);
      }

   };

   return (
      <AuthContext.Provider value={{ isAuthed, register, login, logout, checkLoginStatus }}>
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