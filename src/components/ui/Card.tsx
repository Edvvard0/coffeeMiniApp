import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

const Card = ({ children, className, onClick, hover = false }: CardProps) => {
  return (
    <div
      className={cn(
        'bg-dark-900 rounded-lg border border-dark-800',
        hover && 'hover:border-primary-600 transition-colors cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;

