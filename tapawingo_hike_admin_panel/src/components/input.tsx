import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">{label}</label>
        <input
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            {...props}
        />
      </div>
  );
};

export default Input;
