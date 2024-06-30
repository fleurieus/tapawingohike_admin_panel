import React, { ButtonHTMLAttributes, ForwardRefRenderFunction } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const Button: ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = ({ children, ...props }, ref) => {
  return (
      <button
          ref={ref}
          className="bg-tapawingo_green text-white py-2 px-4 rounded"
          {...props}
      >
        {children}
      </button>
  );
};

export default React.forwardRef(Button);
