import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/formatters';

// Adicionar na interface InputProps (linha ~6)
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

// Substituir o return do componente Input:
export const Input = forwardRef<HTMLInputElement, InputProps>(({ 
  className, 
  label, 
  error, 
  helper,
  id,
  type, // ← ADICIONAR esta linha
  ...props 
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  
  // ← ADICIONAR estas linhas (classes específicas para iOS)
  const dateClasses = type === 'date' ? 
    'text-base [&::-webkit-date-and-time-value]:text-white [&::-webkit-datetime-edit]:text-white [&::-webkit-datetime-edit-fields-wrapper]:text-white' : 
    '';
  
  return (
    <div className="w-full">
      {/* label permanece igual */}
      <input
        id={inputId}
        ref={ref}
        type={type} // ← ADICIONAR esta linha
        className={cn(
          'w-full px-3 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400', // ← MUDAR py-2 para py-3
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'transition-all duration-200 text-base', // ← ADICIONAR text-base
          // ← ADICIONAR estas linhas (classes específicas para campos de data)
          type === 'date' && 'appearance-none [-webkit-appearance:none] [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer',
          // ← ADICIONAR esta linha (iOS específico)
          type === 'date' && 'min-h-[48px] sm:min-h-[40px]',
          dateClasses, // ← ADICIONAR esta linha
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        // ← ADICIONAR estas linhas (propriedades específicas para iOS)
        {...(type === 'date' && {
          'data-date-format': 'dd/mm/yyyy',
          'data-date': props.value || ''
        })}
        {...props}
      />
      {/* error e helper permanecem iguais */}
    </div>
  );
});