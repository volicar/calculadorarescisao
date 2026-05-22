'use client';

import { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  content: string;
  className?: string;
}

export const Tooltip = ({ content, className = '' }: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="text-gray-400 hover:text-emerald-400 transition-colors ml-1.5 flex-shrink-0"
        aria-label="Mais informações"
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      {visible && (
        <div className="absolute z-50 left-6 top-0 w-64 p-3 bg-gray-700 border border-gray-600 rounded-lg shadow-xl text-xs text-gray-200 leading-relaxed animate-fade-in">
          <div className="absolute -left-1.5 top-2 w-3 h-3 bg-gray-700 border-l border-t border-gray-600 rotate-[-45deg]" />
          {content}
        </div>
      )}
    </div>
  );
};
