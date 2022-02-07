import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { StatusCodes } from 'http-status-codes';
import { RegisterRequest } from './model/registerRequest';
import { LoginRequest } from './model/loginRequest';
import { TokenResponse } from './model/tokenResponse';
import { authStore, AuthState } from '../stores/authStore';

export async function registerUser(request: RegisterRequest) {
  return axios.post('/api/v1/users/register', request);
}

export async function loginUser(request: LoginRequest) {
  return axios.post('/api/v1/users/login', request);
}

export async function fetchToken() {
  const res = await axios.get<TokenResponse>('/api/v1/users/refresh');
  axios.defaults.headers.common.Authorization = `Bearer ${res.data.accessToken}`;
  authStore.setState({ authState: jwtDecode<AuthState>(res.data.accessToken) });
}

export async function logoutUser() {
  await axios.get('/api/v1/users/logout');
  axios.defaults.headers.common.Authorization = '';
  authStore.setState({ authState: null });
}

axios.interceptors.response.use((res) => res, async (error) => {
  const req = error.config;

  // once per request token renewal on non login routes
  if (req.url !== '/api/v1/users/login' && error.response.status === StatusCodes.UNAUTHORIZED && !req.retry) {
    req.retry = true;
    await fetchToken();
    return axios(req);
  }
  return Promise.reject(error);
});
