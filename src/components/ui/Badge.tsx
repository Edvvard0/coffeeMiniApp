import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  className?: string;
}

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className,
}: BadgeProps) => {
  const variants = {
    default: 'bg-dark-800 text-gray-300 border border-dark-700',
    primary: 'bg-primary-900 text-primary-300 border border-primary-700',
    success: 'bg-green-900 text-green-300 border border-green-700',
    warning: 'bg-yellow-900 text-yellow-300 border border-yellow-700',
    danger: 'bg-red-900 text-red-300 border border-red-700',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;

