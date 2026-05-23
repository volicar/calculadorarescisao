'use client';

import { Scale, MessageCircle, ArrowRight } from 'lucide-react';

// ============================================================
// LEAD GEN — configure o link de parceria com advogados
// Opções: link de afiliado JusBrasil, WhatsApp do escritório
// parceiro, ou plataforma de indicação jurídica.
// ============================================================
const LINK_ADVOGADO = 'https://wa.me/5500000000000?text=Olá%2C%20preciso%20de%20orientação%20sobre%20minha%20rescisão%20trabalhista'; // substitua pelo link do parceiro

interface LeadGenCardProps {
  motivo?: string;
  className?: string;
}

const MENSAGENS: Record<string, string> = {
  dispensa_com_justa_causa: 'A justa causa pode ser contestada na Justiça do Trabalho. Um advogado pode reverter e garantir seus direitos.',
  pedido_demissao: 'Antes de assinar qualquer documento, converse com um advogado. Pode haver formas melhores de sair.',
  comum_acordo: 'O comum acordo tem regras específicas. Um advogado garante que os termos sejam justos.',
};

export const LeadGenCard = ({ motivo, className = '' }: LeadGenCardProps) => {
  const mensagem = motivo ? MENSAGENS[motivo] : null;

  return (
    <div className={`rounded-xl border border-emerald-700/40 bg-gradient-to-br from-emerald-900/20 to-gray-800/40 p-5 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
          <Scale className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white mb-1">
            Ficou com dúvida sobre sua rescisão?
          </p>
          {mensagem ? (
            <p className="text-xs text-emerald-300 mb-3">{mensagem}</p>
          ) : (
            <p className="text-xs text-gray-400 mb-3">
              Cada situação é única. Um advogado trabalhista pode revisar seus valores, contestar irregularidades e garantir que você receba tudo que tem direito.
            </p>
          )}
          <a
            href={LINK_ADVOGADO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Falar com Advogado Trabalhista
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
