import debug from 'debug';
import axios from 'axios';
import https from 'https';

const axiosDebug = debug('axios');
axiosDebug.color = 3;

const axiosInstance = axios.create({
  responseType: 'arraybuffer',
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

axiosInstance.interceptors.request.use((config) => {
  axiosDebug('Request:', config.method.toUpperCase(), config.url);
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    axiosDebug('Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    axiosDebug('Error:', JSON.stringify(error), error.message);
    return Promise.reject(error);
  },
);

export default axiosInstance;
