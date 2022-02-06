import axios from 'axios';
import { RegisterRequest } from './model/registerRequest';
import { LoginRequest } from './model/loginRequest';

// there will be more functions here in the future
// eslint-disable-next-line import/prefer-default-export
export async function registerUser(request: RegisterRequest) {
  return axios.post('/api/v1/users/register', request);
}

export async function loginUser(request: LoginRequest) {
  return axios.post('/api/v1/users/login', request);
}
