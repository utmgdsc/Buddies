import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { StatusCodes } from 'http-status-codes';
import { RegisterRequest } from './model/registerRequest';
import { LoginRequest } from './model/loginRequest';
import { TokenResponse } from './model/tokenResponse';
import { authStore, AuthState } from '../stores/authStore';
import { CreateProjectRequest } from './model/createProjectRequest';
import { SearchResponse } from './model/searchResponse';

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

export async function createProject(request: CreateProjectRequest) {
  return axios.post('/api/v1/projects', request);
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

export type SearchFunc = (search: string, page: number, count: number) => Promise<SearchResponse>;

export const getLocations: SearchFunc = async (search, page, count) => {
  const res = await axios.get<SearchResponse>(`/api/v1/projects/locations/${search}/${page}/${count}`);
  return res.data;
};

export const getCategories: SearchFunc = async (search, page, count) => {
  const res = await axios.get<SearchResponse>(`/api/v1/projects/category/${search}/${page}/${count}`);
  return res.data;
};

export const getUsers: SearchFunc = async (search, page, count) => {
  const res = await axios.get<SearchResponse>(`/api/v1/projects/email/${search}/${page}/${count}`);
  return res.data;
};

export async function getProject(projectId: string | string[] | undefined){
  return await axios.get(`/api/v1/projects/${projectId}`);
};

export async function addMember(projectId: string | string[] | undefined, userId: number){
  return axios.post(`/api/v1/projects/${projectId}/join/`, userId);
};