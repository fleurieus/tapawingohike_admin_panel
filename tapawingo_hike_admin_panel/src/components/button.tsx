import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
      <button
          className="w-full bg-tapawingo_green text-white py-2 px-4 rounded"
          {...props}
      >
        {children}
      </button>
  );
};

export default Button;
