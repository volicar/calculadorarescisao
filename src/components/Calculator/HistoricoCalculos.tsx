'use client';

import { useEffect, useState } from 'react';
import { HistoricoItem, CalculatorFormData, CalculationResult } from '@/types/calculator';
import { formatCurrency } from '@/utils/formatters';
import { History, Trash2, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

const STORAGE_KEY = 'rescisao_historico';
const MAX_ITEMS = 5;

const MOTIVOS: Record<string, string> = {
  dispensa_sem_justa_causa: 'Sem Justa Causa',
  dispensa_com_justa_causa: 'Justa Causa',
  pedido_demissao: 'Pedido Demissão',
  comum_acordo: 'Comum Acordo',
  termino_contrato: 'Término Contrato',
  aposentadoria: 'Aposentadoria',
};

export const salvarNoHistorico = (formData: CalculatorFormData, result: CalculationResult) => {
  try {
    const historico: HistoricoItem[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');

    const novo: HistoricoItem = {
      id: Date.now().toString(),
      data: new Date().toLocaleDateString('pt-BR'),
      nome: formData.nome,
      salario: formData.salarioMensal,
      motivo: formData.motivoRescisao,
      total: result.total,
      totalLiquido: result.totalLiquido,
      formData,
      result,
    };

    const atualizado = [novo, ...historico].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizado));
  } catch {
    // localStorage indisponível (SSR ou privado)
  }
};

interface HistoricoCalculosProps {
  onRestore: (formData: CalculatorFormData, result: CalculationResult) => void;
}

export const HistoricoCalculos = ({ onRestore }: HistoricoCalculosProps) => {
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [expandido, setExpandido] = useState(false);

  useEffect(() => {
    try {
      const data: HistoricoItem[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
      setHistorico(data);
    } catch {
      setHistorico([]);
    }
  }, []);

  const removerItem = (id: string) => {
    const atualizado = historico.filter(h => h.id !== id);
    setHistorico(atualizado);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizado));
  };

  const limparTudo = () => {
    setHistorico([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  if (historico.length === 0) return null;

  return (
    <div className="mt-4 border border-gray-700/60 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpandido(!expandido)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-800/50 hover:bg-gray-800/80 transition-colors"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <History className="w-4 h-4 text-emerald-400" />
          Histórico de Cálculos ({historico.length})
        </span>
        {expandido ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {expandido && (
        <div className="divide-y divide-gray-700/50">
          {historico.map((item) => (
            <div key={item.id} className="p-4 bg-gray-800/20 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {item.nome && <span className="text-white font-medium text-sm truncate">{item.nome}</span>}
                  <span className="text-xs text-gray-400">{item.data}</span>
                  {item.motivo && (
                    <span className="text-xs px-1.5 py-0.5 bg-gray-700 text-gray-300 rounded">
                      {MOTIVOS[item.motivo] ?? item.motivo}
                    </span>
                  )}
                </div>
                <div className="flex gap-4 mt-1">
                  <span className="text-xs text-gray-400">
                    Bruto: <span className="text-white">{formatCurrency(item.total)}</span>
                  </span>
                  {item.totalLiquido > 0 && (
                    <span className="text-xs text-gray-400">
                      Líquido: <span className="text-emerald-400">{formatCurrency(item.totalLiquido)}</span>
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => onRestore(item.formData, item.result)}
                  className="p-1.5 text-gray-400 hover:text-emerald-400 transition-colors"
                  title="Restaurar este cálculo"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removerItem(item.id)}
                  className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                  title="Remover do histórico"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="p-3 flex justify-end">
            <button
              onClick={limparTudo}
              className="text-xs text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Limpar histórico
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
