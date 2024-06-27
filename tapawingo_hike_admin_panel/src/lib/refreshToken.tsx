import Cookies from 'js-cookie';
import apiClient from './apiClientServer';
import {useEffect, useRef} from "react";

export const checkTokenExpiration = async () => {
  const jwtToken = Cookies.get('jwtToken');
  if (jwtToken) {
    const decodedToken: { exp: number } = JSON.parse(atob(jwtToken.split('.')[1]));
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp - currentTime < 60) {
      await refreshAuthToken();
      const newToken = Cookies.get('jwtToken');
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    }
  }
};

export const refreshAuthToken = async () => {
  try {
    const refreshToken = Cookies.get('refreshToken');
    const response = await apiClient.post('/auth/refresh-token', { token: refreshToken });

    if (response.status === 200) {
      const { jwtToken, refreshToken, expiration } = response.data;

      Cookies.set('jwtToken', jwtToken, {
        expires: new Date(expiration),
        secure: true,
        sameSite: 'Strict',
        path: '/',
      });

      Cookies.set('refreshToken', refreshToken, {
        secure: true,
        sameSite: 'Strict',
        path: '/',
      });
    }
  } catch (error) {
    console.error('Token refresh.ts failed:', error);
  }
};
export function useTokenRefreshInterval(callback: () => void, delay: number) {
  const intervalRef = useRef<number>();

  useEffect(() => {
    intervalRef.current = window.setInterval(callback, delay);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [callback, delay]);

  return intervalRef.current;
}
