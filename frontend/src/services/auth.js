import api from './api';

export const login = (email, password) => api.post('/auth/login', { email, password }).then(res => res.data);
export const register = (userData) => api.post('/auth/register', userData).then(res => res.data);
export const getProfile = () => api.get('/user/profile').then(res => res.data);
