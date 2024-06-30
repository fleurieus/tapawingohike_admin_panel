"use server";
import axios from 'axios';
import { API_BASE_URL } from "@/lib/utils";
import { cookies } from 'next/headers';

const apiServerClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

apiServerClient.interceptors.request.use(
    config => {
      const cookieStore = cookies();
      const token = cookieStore.get('jwtToken')?.value;

      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      } 

      return config;
    },
    error => Promise.reject(error)
);

apiServerClient.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const cookieStore = cookies();
          const refreshToken = cookieStore.get('refreshToken')?.value;

          if (!refreshToken) {
            return Promise.reject(error);
          }

          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            accessToken: cookieStore.get('jwtToken')?.value,
            refreshToken: refreshToken });

          if (response.status === 200) {
            const { jwtToken, refreshToken: newRefreshToken, expiration } = response.data;

            cookies().set('jwtToken', jwtToken, {secure: true, expires: new Date(expiration)});
            cookies().set('refreshToken', newRefreshToken, {secure: true, expires: new Date(expiration)});

            apiServerClient.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${jwtToken}`;

            return apiServerClient(originalRequest);
          }
        } catch (error) {
          console.error('Token refresh.ts failed:', error);
          cookies().delete('jwtToken');
          cookies().delete('refreshToken');
          return Promise.reject(error);
        }
      }

      if (!error.response) {
        console.error('Network or server error:', error);
      }
      return Promise.reject(error);
    }
);

export default apiServerClient;
