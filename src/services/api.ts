import axios from 'axios';

const api = axios.create({
  baseURL: 'http://8890519ec383.ngrok.io',
});

export default api;
