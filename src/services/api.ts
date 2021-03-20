import axios from 'axios';

export const API_URL = 'http://localhost:3333';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

export default api;
