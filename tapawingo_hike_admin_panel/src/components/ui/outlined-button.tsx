import React, { ButtonHTMLAttributes } from 'react';

interface OutlinedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const OutlinedButton: React.FC<OutlinedButtonProps> = ({ children, ...props }) => {
  return (
      <button
          className="w-full bg-transparent text-tapawingo_green border border-tapawingo_green py-2 px-4 rounded"
          {...props}
      >
        {children}
      </button>
  );
};

export default OutlinedButton;
