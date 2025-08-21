import AuthExports from "../../context/AuthContext";

export const useAuthToken = () => {
   const { token } = AuthExports.useAuthContext();
   return token;
};