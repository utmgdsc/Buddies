import axios from 'axios';
import { RegisterRequest } from './model/registerRequest';
import { LoginRequest } from './model/loginRequest';
import { TokenResponse } from './model/tokenResponse';

export async function registerUser(request: RegisterRequest) {
  return axios.post('/api/v1/users/register', request);
}

export async function loginUser(request: LoginRequest) {
  return axios.post('/api/v1/users/login', request);
}

export async function fetchToken() {
  const res = await axios.get<TokenResponse>('/api/v1/users/refresh');
  axios.defaults.headers.common.Authorization = `Bearer ${res.data.accessToken}`;
  return res.data.accessToken;
}

export async function logoutUser() {
  await axios.get('/api/v1/users/logout');
  axios.defaults.headers.common.Authorization = '';
}
