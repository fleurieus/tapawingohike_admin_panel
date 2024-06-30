import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL } from "@/lib/utils";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

apiClient.interceptors.request.use(
    config => {
       const token = Cookies.get('jwtToken');

      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      } 

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

          if (!refreshToken) {
            return Promise.reject(error);
          }

          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            accessToken: Cookies.get('jwtToken'),
            refreshToken: refreshToken
          });

          if (response.status === 200) {
            const { jwtToken, refreshToken: newRefreshToken, expiration } = response.data;
            const expirationDate = new Date(expiration);

            Cookies.set('jwtToken', jwtToken, { expires: expirationDate, secure: true, sameSite: 'Strict' });
            Cookies.set('refreshToken', newRefreshToken, { expires: expirationDate, secure: true, sameSite: 'Strict' });

            apiClient.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${jwtToken}`;

            return apiClient(originalRequest);
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          Cookies.remove('jwtToken');
          Cookies.remove('refreshToken');
          return Promise.reject(error);
        }
      }

      if (!error.response) {
        console.error('Network or server error:', error);
      }
      return Promise.reject(error);
    }
);

export default apiClient;
