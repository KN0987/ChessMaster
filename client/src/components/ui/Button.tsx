import { ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Button = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 cartoon-button";
  
  const variants = {
    primary: "bg-primary-500 text-white hover:bg-primary-600 focus:ring-4 focus:ring-primary-300 border-4 border-gray-900",
    secondary: "bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-4 focus:ring-secondary-300 border-4 border-gray-900",
    outline: "bg-white border-4 border-gray-900 hover:bg-gray-50 focus:ring-4 focus:ring-gray-200",
    ghost: "bg-transparent hover:bg-gray-100 focus:ring-4 focus:ring-gray-200",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-4 focus:ring-red-300 border-4 border-gray-900",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-xl",
    md: "px-4 py-2 text-base rounded-xl",
    lg: "px-6 py-3 text-lg rounded-2xl",
  };
  
  const combinedClassName = twMerge(
    clsx(
      baseStyles,
      variants[variant],
      sizes[size],
      fullWidth && "w-full",
      (disabled || isLoading) && "opacity-70 cursor-not-allowed transform-none hover:transform-none",
      className
    )
  );

  return (
    <button
      className={combinedClassName}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
          <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button