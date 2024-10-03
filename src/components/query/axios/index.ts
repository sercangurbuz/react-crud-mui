import axios from 'axios';

import paramsSerializer from './paramsSerializer';

const instance = axios.create({
  paramsSerializer,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    'If-Modified-Since': 'Mon, 26 Jul 1997 05:00:00 GMT',
  },
});

export default instance;
