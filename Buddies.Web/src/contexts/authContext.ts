import React, { createContext } from 'react';
import jwtDecode, { JwtPayload } from 'jwt-decode';

export interface AuthAction {
  type: 'LOGIN' | 'LOGOUT',
  data: string | null
}

export interface AuthState extends JwtPayload {
  // look into generating these from the backend in the future
  nameid: string,
  given_name: string,
  family_name: string
}

export const AuthContext = createContext<[AuthState | null, React.Dispatch<AuthAction>]>(null!);

export function authReducer(prevState: AuthState | null, action: AuthAction) {
  switch (action.type) {
    case 'LOGIN':
      return jwtDecode<AuthState>(action.data!);
    case 'LOGOUT':
      return null;
    default:
      return prevState;
  }
}
