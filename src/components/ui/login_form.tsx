"use client";

import Button from "./button";
import { Input } from "@/components/ui/input";
import { Label } from "./label";
import React, { useState } from "react";
import { setCookie } from 'nookies';
import { API_BASE_URL } from "@/lib/utils";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Incorrect email or password');
      }

      const data = await response.json();
      const { jwtToken, refreshToken, expiration } = data;

      const expirationDate = new Date(expiration);
      setCookie(null, 'jwtToken', jwtToken, { expires: expirationDate, secure: true, sameSite: 'Strict' });
      setCookie(null, 'refreshToken', refreshToken, { expires: expirationDate, secure: true, sameSite: 'Strict' });
      setCookie(null, 'tokenExpiration', expiration, { expires: expirationDate, secure: true, sameSite: 'Strict' });
      router.push('/organisations');
    } catch (error) {
      console.error('Login error:', error);
      setError('Logging in failed, try again');
    } finally {
      setLoading(false);
    }
  };

  return (
      <form onSubmit={handleSubmit}
            className="bg-white p-8 rounded shadow-md w-full max-w-sm mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Tapawingo Hike Admin Panel</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <Label htmlFor="email" className="text-right mb-2">
          Email
        </Label>
        <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mb-4"
        />
        <Label htmlFor="password" className="text-right mb-2">
          Password
        </Label>
        <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mb-4"
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </Button>
      </form>
  );
};

export default LoginForm;
