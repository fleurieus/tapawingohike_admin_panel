import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
      <button
          className="w-full bg-tapawingo_green hover:bg-green-500 text-white py-2 px-4 rounded transition duration-150"
          {...props}
      >
        {children}
      </button>
  );
};

export default Button;
