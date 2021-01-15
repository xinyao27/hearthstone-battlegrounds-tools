import axios from 'axios';
import qs from 'querystring';

export default axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:23333/api'
      : 'https://hs.chenyueban.com/api',
  timeout: process.env.NODE_ENV === 'development' ? 10000 : 15000,
  paramsSerializer: (params) => qs.stringify(params),
});

export function getAuthConfig() {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('hbt_token')}`,
    },
  };
}
