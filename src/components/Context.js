import { createContext, useContext } from 'react';
export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);
export const UserContext = createContext(null);
export const useUser = () => useContext(UserContext);