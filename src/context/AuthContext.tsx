import React, { createContext, useState, useContext } from 'react';
import { login as loginService } from '../services/auth';

interface AuthContextData {
  token: string;
  login: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState('');

  const login = async (email: string, password: string) => {
    const data = await loginService(email, password);
    setToken(data.access_token);
  };

  return (
    <AuthContext.Provider value={{ token, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

