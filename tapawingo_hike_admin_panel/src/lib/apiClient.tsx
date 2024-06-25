import axios from 'axios';
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import {API_BASE_URL} from "@/lib/utils";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${Cookies.get('jwtToken')}`,
  },
});

apiClient.interceptors.request.use(
    config => {
      return config;
    },
    error => Promise.reject(error)
);

apiClient.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const refreshToken = Cookies.get('refreshToken');
          const response = await axios.post('http://localhost:5175/auth/refresh', { token: refreshToken });

          if (response.status === 200) {
            const { jwtToken, refreshToken, expiration } = response.data;
            Cookies.set('jwtToken', jwtToken, {
              expires: new Date(expiration),
              secure: true,
              sameSite: 'Strict',
            });
            Cookies.set('refreshToken', refreshToken, {
              expires: new Date(expiration),
              secure: true,
              sameSite: 'Strict',
            });
            Cookies.set('tokenExpiration', expiration);

            apiClient.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${jwtToken}`;

            return apiClient(originalRequest);
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
        }
      }
      if (!error.response) {
        console.error('Network or server error:', error);
      }
      return Promise.reject(error);
    }
);

export default apiClient;
