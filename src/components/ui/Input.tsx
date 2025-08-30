import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/formatters';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ 
  className, 
  label, 
  error, 
  helper,
  id,
  ...props 
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-200 mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        className={cn(
          'w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'transition-all duration-200',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
      {helper && !error && (
        <p className="mt-1 text-sm text-gray-400">{helper}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';