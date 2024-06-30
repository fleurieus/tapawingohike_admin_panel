"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import Cookies from 'js-cookie';

interface JwtPayload {
  [key: string]: any;
}

interface UserContextProps {
  role: string | null;
  setRole: (role: string | null) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

const extractRole = (payload: JwtPayload): string | null => {
  const roleEntry = Object.entries(payload).find(([key]) => key.endsWith('Role'));
  return roleEntry ? roleEntry[1] : null;
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const jwtToken = Cookies.get('jwtToken');
    if (jwtToken) {
      const decodedToken = jwtDecode<JwtPayload>(jwtToken);
      const extractedRole = extractRole(decodedToken);
      setRole(extractedRole);
    }
  }, []);

  return (
      <UserContext.Provider value={{ role, setRole }}>
        {children}
      </UserContext.Provider>
  );
};
