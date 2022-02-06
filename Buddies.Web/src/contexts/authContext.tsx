import React, { createContext, useReducer, useMemo } from 'react';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import axios from 'axios';

interface AuthAction {
  type: 'LOGIN' | 'LOGOUT',
  data: string | null
}

type AuthState = JwtPayload & {
  nameid: string,
  given_name: string,
  family_name: string
} | null;

export const AuthContext = createContext<[AuthState, React.Dispatch<AuthAction>]>(null!);

function authReducer(prevState: AuthState, action: AuthAction) {
  switch (action.type) {
    case 'LOGIN':
      axios.defaults.headers.common.Authorization = `Bearer ${action.data!}`;
      return jwtDecode<AuthState>(action.data!);
    case 'LOGOUT':
      axios.defaults.headers.common.Authorization = '';
      return null;
    default:
      return prevState;
  }
}

export const AuthProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, null);

  const authContext = useMemo<[AuthState, React.Dispatch<AuthAction>]>(() => {
    return [state, dispatch];
  }, []);

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};
