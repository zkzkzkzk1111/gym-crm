import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { useAuthStore } from '@/stores/auth';

// Axios 인스턴스 생성
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://54.180.238.9:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - 토큰 자동 추가
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore();
    const token = authStore.user?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - 에러 처리
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const authStore = useAuthStore();

    // 401 Unauthorized - 자동 로그아웃
    if (error.response?.status === 401) {
      authStore.logout();
    }

    // 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden');
    }

    // 503 Service Unavailable
    if (error.response?.status === 503) {
      console.error('Server is temporarily unavailable. Please try again later.');
    }

    // Network Error (서버 연결 불가)
    if (error.code === 'ERR_NETWORK' || error.code === 'ERR_BAD_RESPONSE') {
      console.error('Unable to connect to server. Please check your connection or try again later.');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;