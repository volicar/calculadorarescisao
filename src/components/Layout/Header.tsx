'use client';

import Link from 'next/link';
import { Calculator, Menu, X, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useScrollNavigation } from '@/hooks/useScrollNavigation';
import { cn } from '@/utils/formatters';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLight, setIsLight] = useState(false);
  const { activeSection, scrollToSection } = useScrollNavigation();

  // Restore theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      document.documentElement.classList.add('light');
      setIsLight(true);
    }
  }, []);

  const toggleTheme = () => {
    const next = !isLight;
    setIsLight(next);
    if (next) {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    }
  };

  const menuItems = [
    { label: 'Início', id: 'home', type: 'scroll' },
    { label: 'Como Funciona', id: 'como-funciona', type: 'scroll' },
    { label: 'Dúvidas', id: 'faq', type: 'scroll' },
    { label: 'Blog', id: '/blog', type: 'link' },
    { label: 'Sobre', id: '/sobre', type: 'link' },
  ];

  const handleMenuClick = (item: typeof menuItems[0]) => {
    if (item.type === 'scroll') scrollToSection(item.id);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-gray-900/95 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity group">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-500 rounded-full group-hover:bg-primary-600 transition-colors">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-lg">Rescisão</span>
              <span className="text-primary-400 font-normal ml-1">Online</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              item.type === 'link' ? (
                <Link
                  key={item.id}
                  href={item.id}
                  className="text-white hover:text-primary-400 transition-colors duration-200 font-medium px-3 py-2"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    'relative px-3 py-2 font-medium transition-all duration-200 hover:text-primary-400',
                    activeSection === item.id ? 'text-primary-400' : 'text-white'
                  )}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400 rounded-full" />
                  )}
                </button>
              )
            ))}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-primary-400 transition-colors rounded-lg hover:bg-gray-800"
              title={isLight ? 'Ativar modo escuro' : 'Ativar modo claro'}
              aria-label="Alternar tema"
            >
              {isLight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile right */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-primary-400 transition-colors"
              aria-label="Alternar tema"
            >
              {isLight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button
              className="text-white hover:text-primary-400 transition-colors p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-800 bg-gray-900/95 backdrop-blur-sm animate-fade-in">
            <div className="py-4 space-y-2">
              {menuItems.map((item) => (
                item.type === 'link' ? (
                  <Link
                    key={item.id}
                    href={item.id}
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-left px-4 py-3 font-medium transition-colors hover:bg-gray-800 rounded-lg text-white"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item)}
                    className={cn(
                      'block w-full text-left px-4 py-3 font-medium transition-colors hover:bg-gray-800 rounded-lg',
                      activeSection === item.id ? 'text-primary-400 bg-gray-800' : 'text-white'
                    )}
                  >
                    {item.label}
                  </button>
                )
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
