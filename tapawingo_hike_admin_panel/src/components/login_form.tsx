'use client';
import React, { useState } from 'react';
import Input from './input';
import Button from './button';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
   //TODO Add login functionality
    console.log({ email, password });
  };

  return (
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Tapawingo Hike Admin Panel</h2>
        <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
        />
        <Input
            label="Wachtwoord"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
        />
        <Button type="submit">Log in</Button>
      </form>
  );
};

export default LoginForm;
