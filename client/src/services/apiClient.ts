import axios, {
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';

const apiClient = ({ req }: any) => {
  return axios.create({
    baseURL: '/api',
    responseType: 'json',
    headers: req.headers,
  });
};

export default apiClient;
