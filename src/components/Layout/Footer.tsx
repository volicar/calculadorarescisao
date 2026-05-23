import Link from 'next/link';
import { Lock, Shield, Smartphone, CheckCircle2 } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <p className="text-white font-semibold text-lg mb-2">Rescisão Online</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Calculadora gratuita de verbas rescisórias atualizada com a legislação trabalhista de 2025.
            </p>
          </div>

          <div>
            <p className="text-gray-300 font-medium mb-3 text-sm uppercase tracking-wider">Navegação</p>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">Calculadora</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-white text-sm transition-colors">Blog</Link></li>
              <li><Link href="/sobre" className="text-gray-400 hover:text-white text-sm transition-colors">Sobre</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-gray-300 font-medium mb-3 text-sm uppercase tracking-wider">Privacidade</p>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-gray-400 text-sm"><Lock className="w-3.5 h-3.5 flex-shrink-0" /> Sem coleta de dados pessoais</li>
              <li className="flex items-center gap-2 text-gray-400 text-sm"><Shield className="w-3.5 h-3.5 flex-shrink-0" /> Cálculos feitos no seu navegador</li>
              <li className="flex items-center gap-2 text-gray-400 text-sm"><Smartphone className="w-3.5 h-3.5 flex-shrink-0" /> Funciona em qualquer dispositivo</li>
              <li className="flex items-center gap-2 text-gray-400 text-sm"><CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Sua privacidade protegida</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            Copyright © {new Date().getFullYear()} Rescisão Online. Ferramenta de estimativa — não substitui assessoria jurídica.
          </p>
        </div>
      </div>
    </footer>
  );
};
