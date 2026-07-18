'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface LoadingCalculoProps {
  onDone: () => void;
}

// Passos reais que o motor executa — não é "fake", é transparência do cálculo (labor illusion honesta).
const PASSOS = [
  'Somando as verbas rescisórias',
  'Aplicando as tabelas de INSS e IRRF de 2026',
  'Verificando a isenção da Lei 15.270/2025',
  'Calculando FGTS, multa e seguro-desemprego',
];

const DURACAO_POR_PASSO = 380; // ms

export const LoadingCalculo = ({ onDone }: LoadingCalculoProps) => {
  const [passoAtual, setPassoAtual] = useState(0);
  const chamouOnDone = useRef(false);

  const finalizar = () => {
    if (!chamouOnDone.current) {
      chamouOnDone.current = true;
      onDone();
    }
  };

  useEffect(() => {
    // Respeita quem desativou animações: entrega o resultado quase na hora
    const reduzirMovimento =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduzirMovimento) {
      const t = setTimeout(finalizar, 200);
      return () => clearTimeout(t);
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    PASSOS.forEach((_, i) => {
      timers.push(setTimeout(() => setPassoAtual(i + 1), DURACAO_POR_PASSO * (i + 1)));
    });
    timers.push(setTimeout(finalizar, DURACAO_POR_PASSO * PASSOS.length + 350));

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progresso = Math.round((passoAtual / PASSOS.length) * 100);

  return (
    <Card className="animate-fade-in" title="Calculando sua rescisão">
      <div className="py-2" role="status" aria-live="polite">
        <p className="sr-only">Calculando sua rescisão, aguarde.</p>

        {/* Barra de progresso */}
        <div className="h-1.5 w-full bg-gray-700/60 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.max(progresso, 8)}%` }}
          />
        </div>

        <ul className="space-y-3">
          {PASSOS.map((passo, i) => {
            const concluido = i < passoAtual;
            const ativo = i === passoAtual;
            return (
              <li key={passo} className="flex items-center gap-3">
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                    concluido
                      ? 'bg-primary-500 border-primary-500'
                      : ativo
                        ? 'border-primary-500/60 bg-primary-500/10'
                        : 'border-gray-700 bg-gray-800/40'
                  }`}
                >
                  {concluido ? (
                    <Check className="w-3.5 h-3.5 text-gray-900" />
                  ) : ativo ? (
                    <Loader2 className="w-3.5 h-3.5 text-primary-400 animate-spin" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                  )}
                </span>
                <span
                  className={`text-sm transition-colors ${
                    concluido ? 'text-gray-300' : ativo ? 'text-white font-medium' : 'text-gray-500'
                  }`}
                >
                  {passo}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
};
