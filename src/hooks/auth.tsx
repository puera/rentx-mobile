import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import axios from 'axios';
import { Alert } from 'react-native';
import { database } from '../database';
import { api } from '../services/api';
import { User as ModelUser } from '../database/models/User';

interface User {
  id: string;
  user_id: string;
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
  signOut: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
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

      let userCreated: User;

      const userCollection = database.get<ModelUser>('users');
      await database.write(async () => {
        await userCollection.create((newUser) => {
          newUser.user_id = user.id;
          newUser.name = user.name;
          newUser.email = user.email;
          newUser.avatar = user.avatar;
          newUser.driver_license = user.driver_license;
          newUser.token = token;

          userCreated = {
            id: newUser.id,
            user_id: newUser.user_id,
            name: newUser.name,
            email: newUser.email,
            avatar: newUser.avatar,
            driver_license: newUser.driver_license,
            token: newUser.token,
          };
        });
      });

      setData({ ...userCreated, token });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (
          error.response.data.message.toLowerCase() ===
          'email or password incorret!'
        ) {
          Alert.alert('Opa!', 'Digite corretamente seu e-mail e senha');
        }
      } else {
        Alert.alert(
          'Erro na autenticação',
          'Algum problema aconteceu , tente novamente mais tarde',
        );
      }
    }
  }

  async function signOut() {
    try {
      const userCollection = database.get<ModelUser>('users');
      await database.write(async () => {
        const userSelected = await userCollection.find(data.id);
        await userSelected.destroyPermanently();
      });
      setData({} as User);
    } catch (error) {
      throw new Error(error);
    }
  }

  async function updateUser(user: User) {
    try {
      const userCollection = database.get<ModelUser>('users');
      await database.write(async () => {
        const userSelected = await userCollection.find(data.id);
        await userSelected.update((userData) => {
          userData.name = user.name;
          userData.driver_license = user.driver_license;
          userData.avatar = user.avatar;
        });
      });

      setData(user);
    } catch (error) {
      throw new Error(error);
    }
  }

  useEffect(() => {
    (async () => {
      const userCollection = database.get<ModelUser>('users');
      const response = await userCollection.query().fetch();

      if (response.length > 0) {
        const userData = response[0]._raw as unknown as User;
        api.defaults.headers.common.Authorization = `Bearer ${userData.token}`;

        setData(userData);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ signIn, signOut, updateUser, user: data }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
