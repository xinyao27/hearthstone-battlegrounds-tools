import axios from 'axios';
import qs from 'querystring';

axios.defaults.timeout = 10000;
axios.defaults.baseURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:23333/api'
    : 'https://hs.chenyueban.com/api';
axios.defaults.paramsSerializer = (params) => qs.stringify(params);
axios.defaults.headers = {
  Authorization: `Bearer ${localStorage.getItem('hbt_token')}`,
};

export default axios;
