import create from 'zustand';
import { JwtPayload } from 'jwt-decode';

// look into generating this from the backend in the future
export interface AuthState extends JwtPayload {
  /**
   * ID of the currently logged in user.
   */
  nameid: string
  /**
   * First name of the currently logged in user.
   */
  given_name: string
  /**
   * Last name of the currently logged in user.
   */
  family_name: string
  email: string
}

export const authStore = create<{ authState: AuthState | null }>(() => ({ authState: null }));
