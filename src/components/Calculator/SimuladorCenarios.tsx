'use client';

import { useState, useEffect } from 'react';
import { CalculatorFormData, CalculationResult } from '@/types/calculator';
import { calculateRescisao } from '@/utils/calculations';
import { formatCurrency } from '@/utils/formatters';
import { GitCompare, ChevronDown, ChevronUp, CheckCircle, XCircle, Trophy } from 'lucide-react';

interface Cenario {
  motivo: CalculatorFormData['motivoRescisao'];
  label: string;
  cor: string;
  avisoPrevio: CalculatorFormData['avisoPrevio'];
}

const CENARIOS: Cenario[] = [
  { motivo: 'dispensa_sem_justa_causa', label: 'Sem Justa Causa', cor: 'text-green-400 border-green-600/40 bg-green-900/10', avisoPrevio: 'indenizado' },
  { motivo: 'comum_acordo', label: 'Comum Acordo', cor: 'text-blue-400 border-blue-600/40 bg-blue-900/10', avisoPrevio: 'indenizado' },
  { motivo: 'pedido_demissao', label: 'Pedido Demissão', cor: 'text-yellow-400 border-yellow-600/40 bg-yellow-900/10', avisoPrevio: 'nao_aplicavel' },
  { motivo: 'dispensa_com_justa_causa', label: 'Justa Causa', cor: 'text-red-400 border-red-600/40 bg-red-900/10', avisoPrevio: 'nao_aplicavel' },
];

interface LinhaComparacao {
  label: string;
  valores: (number | boolean | null)[];
  tipo: 'money' | 'bool';
}

interface SimuladorCenariosProps {
  formData: CalculatorFormData;
}

export const SimuladorCenarios = ({ formData }: SimuladorCenariosProps) => {
  // Recurso mais diferenciado do site: abre já calculado junto com o resultado
  const [expandido, setExpandido] = useState(true);
  const [resultados, setResultados] = useState<(CalculationResult | null)[]>([]);
  const [calculado, setCalculado] = useState(false);

  useEffect(() => {
    const res = CENARIOS.map(cenario =>
      calculateRescisao({
        ...formData,
        motivoRescisao: cenario.motivo,
        avisoPrevio: cenario.avisoPrevio,
      })
    );
    setResultados(res);
    setCalculado(true);
  }, [formData]);

  const handleToggle = () => {
    setExpandido(!expandido);
  };

  const linhas: LinhaComparacao[] = calculado
    ? [
        { label: 'Saldo de Salário', valores: resultados.map(r => r?.saldoSalario ?? null), tipo: 'money' },
        { label: 'Férias Vencidas', valores: resultados.map(r => r?.feriasVencidas ?? null), tipo: 'money' },
        { label: 'Férias Proporcionais', valores: resultados.map(r => r?.feriasPROPorcionais ?? null), tipo: 'money' },
        { label: '13° Proporcional', valores: resultados.map(r => r?.decimoTerceiroProporcional ?? null), tipo: 'money' },
        { label: 'FGTS + Multa', valores: resultados.map(r => r?.fgtsMulta ?? null), tipo: 'money' },
        { label: 'Aviso Prévio', valores: resultados.map(r => r?.avisoPrevioIndenizado ?? null), tipo: 'money' },
        { label: 'Seguro Desemprego', valores: resultados.map(r => r?.seguroDesemprego.temDireito ?? null), tipo: 'bool' },
        { label: 'Total Bruto', valores: resultados.map(r => r?.total ?? null), tipo: 'money' },
        { label: 'Estimativa Líquida', valores: resultados.map(r => r?.totalLiquido ?? null), tipo: 'money' },
      ]
    : [];

  const melhorTotal = calculado ? Math.max(...resultados.map(r => r?.total ?? 0)) : 0;

  return (
    <div id="simulador-cenarios" className="mt-6 border border-emerald-700/40 rounded-xl overflow-hidden scroll-mt-24">
      <button
        onClick={handleToggle}
        aria-expanded={expandido}
        className="w-full flex items-center justify-between px-4 py-4 bg-emerald-900/15 hover:bg-emerald-900/25 transition-colors"
      >
        <div className="flex items-start gap-3 text-left">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <GitCompare className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Simulador de Cenários</p>
            <p className="text-xs text-gray-300 mt-0.5">Compare o que você receberia em cada tipo de rescisão com os mesmos dados</p>
          </div>
        </div>
        {expandido ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
      </button>

      {expandido && calculado && (
        <div className="p-4 overflow-x-auto">
          {/* Cards no mobile */}
          <div className="block sm:hidden space-y-3">
            {CENARIOS.map((cenario, i) => {
              const r = resultados[i];
              if (!r) return null;
              const isMelhor = r.total === melhorTotal;
              return (
                <div key={cenario.motivo} className={`p-4 rounded-lg border ${cenario.cor} relative`}>
                  {isMelhor && (
                    <span className="absolute top-2 right-2 text-xs font-semibold bg-emerald-500 text-gray-900 px-2 py-0.5 rounded-full">Melhor</span>
                  )}
                  <p className="font-semibold text-sm mb-3">{cenario.label}</p>
                  <div className="space-y-1.5 text-xs">
                    {linhas.map((linha) => (
                      <div key={linha.label} className="flex justify-between">
                        <span className="text-gray-400">{linha.label}</span>
                        {linha.tipo === 'bool' ? (
                          linha.valores[i]
                            ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                            : <XCircle className="w-3.5 h-3.5 text-gray-400" />
                        ) : (
                          <span className={`font-medium ${linha.label.includes('Líquida') || linha.label.includes('Bruto') ? 'text-white' : 'text-gray-300'}`}>
                            {(linha.valores[i] as number) > 0 ? formatCurrency(linha.valores[i] as number) : '—'}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tabela no desktop */}
          <table className="hidden sm:table w-full text-sm">
            <caption className="sr-only">Comparação de verbas rescisórias entre os tipos de rescisão, com os mesmos dados informados</caption>
            <thead>
              <tr>
                <th scope="col" className="text-left py-2 pr-4 text-gray-400 font-medium text-xs w-40">Verba</th>
                {CENARIOS.map((c, i) => (
                  <th key={c.motivo} scope="col" className="py-2 px-2 text-center text-xs font-medium">
                    <span className={`${c.cor.split(' ')[0]}`}>{c.label}</span>
                    {resultados[i]?.total === melhorTotal && (
                      <span className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-normal">
                        <Trophy className="w-3 h-3" /> Melhor
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/40">
              {linhas.map((linha) => (
                <tr key={linha.label} className={linha.label.includes('Bruto') || linha.label.includes('Líquida') ? 'bg-gray-800/30 font-semibold' : ''}>
                  <th scope="row" className="py-2 pr-4 text-gray-400 text-xs font-medium text-left">{linha.label}</th>
                  {linha.valores.map((val, i) => (
                    <td key={i} className="py-2 px-2 text-center">
                      {linha.tipo === 'bool' ? (
                        val
                          ? <><CheckCircle aria-hidden className="w-4 h-4 text-emerald-400 mx-auto" /><span className="sr-only">Tem direito</span></>
                          : <><XCircle aria-hidden className="w-4 h-4 text-gray-400 mx-auto" /><span className="sr-only">Não tem direito</span></>
                      ) : (
                        <span className={`text-xs ${(val as number) > 0 ? 'text-gray-300' : 'text-gray-400'}`}>
                          {(val as number) > 0 ? formatCurrency(val as number) : '—'}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <p className="mt-3 text-xs text-gray-400 text-center">
            Simulação com os mesmos dados informados. Valores são estimativas — regras específicas podem variar.
          </p>
        </div>
      )}
    </div>
  );
};
