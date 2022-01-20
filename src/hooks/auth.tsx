import React, { createContext, ReactNode, useContext, useState } from 'react';
import { api } from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
  driver_license: string;
  avatar: string;
  token: string;
}

interface SignInCrendentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  signIn: (credentials: SignInCrendentials) => Promise<void>;
}

interface AuthContextProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: AuthContextProps) {
  const [data, setData] = useState<User>({} as User);

  async function signIn({ email, password }: SignInCrendentials) {
    try {
      const response = await api.post('sessions', { email, password });
      const { user, token } = response.data;
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      setData({ ...user, token });
    } catch (error) {
      throw new Error(error);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, user: data }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
