import debug from 'debug';
import axios from 'axios';
import https from 'https';
import chalk from 'chalk';

const axiosDebug = debug('axios');
axiosDebug.color = 3;

const axiosInstance = axios.create({
  responseType: 'arraybuffer',
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

axiosInstance.interceptors.request.use((config) => {
  axiosDebug('Request:', chalk.blueBright(config.method.toUpperCase()), config.url);
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    axiosDebug('Response:', `${chalk.green(response.status)}`, response.config.url);
    return response;
  },
  (error) => {
    axiosDebug('Error:', chalk.red(error.status), error.message);
    return Promise.reject(error);
  },
);

export default axiosInstance;
