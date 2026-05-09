import axios from 'axios';
import type { AxiosError } from 'axios';
import { API_BASE_URL } from '../constants/app.constants';

export interface ApiErrorResponse {
  message: string;
}

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response) {
      const serverMessage = error.response.data?.message;
      console.error(
        `Dummy Api Status ${error.response.status}`,
        serverMessage ?? error.message,
      );
    } else if (error.request) {
      console.error('Dummy Api No response received:', error.message);
    }

    return Promise.reject(error);
  },
);

export default http;