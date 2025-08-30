'use client';

import { useState } from 'react';

export const Footer = () => {
  const [showContact, setShowContact] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
            <button 
              onClick={() => setShowContact(!showContact)}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              Contato
            </button>
            <button 
              onClick={() => setShowPrivacy(!showPrivacy)}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              Política de Privacidade
            </button>
            <button 
              onClick={() => scrollToSection('home')}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              Voltar ao Topo
            </button>
          </div>
          
          <div className="text-gray-400 text-sm">
            Copyright © 2025 Vinicius
          </div>
        </div>

        {/* Contact Info */}
        {showContact && (
          <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700 animate-fade-in">
            <h3 className="text-white font-semibold mb-2">Entre em Contato</h3>
            <p className="text-gray-300 text-sm">
              📧 contato@rescisao2025.com.br<br/>
              📱 WhatsApp: (11) 99999-9999<br/>
              🌐 Desenvolvido por Vinicius
            </p>
          </div>
        )}

        {/* Privacy Policy */}
        {showPrivacy && (
          <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700 animate-fade-in">
            <h3 className="text-white font-semibold mb-2">Política de Privacidade</h3>
            <p className="text-gray-300 text-sm">
              🔒 Não coletamos dados pessoais<br/>
              🛡️ Todos os cálculos são feitos no seu navegador<br/>
              📱 Nenhuma informação é enviada para servidores<br/>
              ✅ Sua privacidade está protegida
            </p>
          </div>
        )}
      </div>
    </footer>
  );
};