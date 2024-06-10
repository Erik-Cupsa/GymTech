import axios from 'axios';
import config from '../../config';

const backendUrl = `http://${config.dev.backendHost}:${config.dev.backendPort}`;
const frontendUrl = `http://${config.dev.host}:${config.dev.port}`;

// Creating an instance of Axios with the base URL
const AXIOS = axios.create({
  baseURL: backendUrl,
  headers: { 'Access-Control-Allow-Origin': frontendUrl }
});

export default AXIOS;
