import axios from 'axios';

import { API_URL } from '@env';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

export default api;
