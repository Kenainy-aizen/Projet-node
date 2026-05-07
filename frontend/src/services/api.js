import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (data) => api.post('/auth/register', data);
export const getAllMateriel = () => api.get('/materiel');
export const addMateriel = (data) => api.post('/materiel', data);
export const updateMateriel = (id, data) => api.put(`/materiel/${id}`, data);
export const deleteMateriel = (id) => api.delete(`/materiel/${id}`);
export const getBilan = () => api.get('/materiel/bilan');
