import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className }: CardProps) => {
  return (
    <div 
      className={twMerge(
        "cartoon-card",
        className
      )}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

const CardHeader = ({ children, className }: CardHeaderProps) => {
  return (
    <div 
      className={twMerge(
        "px-6 py-4 border-b-4 border-gray-900",
        className
      )}
    >
      {children}
    </div>
  );
};

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

const CardBody = ({ children, className }: CardBodyProps) => {
  return (
    <div className={twMerge("px-6 py-4", className)}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

const CardFooter = ({ children, className }: CardFooterProps) => {
  return (
    <div 
      className={twMerge(
        "px-6 py-4 border-t-4 border-gray-900",
        className
      )}
    >
      {children}
    </div>
  );
};

export { Card, CardHeader, CardBody, CardFooter };