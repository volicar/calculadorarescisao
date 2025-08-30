'use client';

import { useEffect, useState } from 'react';

export const useScrollNavigation = () => {
  const [activeSection, setActiveSection] = useState<string>('home');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80; // altura do header fixo
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Detectar seção ativa durante scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'como-funciona', 'blog'];
      const scrollPosition = window.scrollY + 100; // offset para header

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return {
    activeSection,
    scrollToSection,
    scrollToTop
  };
};