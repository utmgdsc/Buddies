import create from 'zustand';
import { JwtPayload } from 'jwt-decode';

export interface AuthState extends JwtPayload {
  // look into generating these from the backend in the future
  nameid: string,
  given_name: string,
  family_name: string
}

export const authStore = create<{ authState: AuthState | null }>(() => ({ authState: null }));
