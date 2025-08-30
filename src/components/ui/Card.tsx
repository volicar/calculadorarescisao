import { ReactNode } from 'react';
import { cn } from '@/utils/formatters';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export const Card = ({ children, className, title }: CardProps) => {
  return (
    <div className={cn(
      'bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6',
      'shadow-lg backdrop-blur-sm',
      className
    )}>
      {title && (
        <h3 className="text-lg font-semibold text-white mb-4 flex justify-center">{title}</h3>
      )}
      {children}
    </div>
  );
};