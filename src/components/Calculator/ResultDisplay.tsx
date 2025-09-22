'use client';

import { CalculationResult } from '@/types/calculator';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/utils/formatters';
import { AdsterraAd } from '../AdsterraAd';
import { useState } from 'react';

interface ResultDisplayProps {
  result: CalculationResult | null;
  nome?: string;
  dadosOriginais?: {
    salarioMensal: number;
    dataAdmissao: string;
    dataDemissao: string;
    tipoContrato: string;
    motivoRescisao?: string;
    tempoContrato?: number;
    avisoPrevio?: string;
    temFGTS: boolean;
  };
}

export const ResultDisplay = ({ result, nome, dadosOriginais }: ResultDisplayProps) => {
  const [mostrarCalculos, setMostrarCalculos] = useState(false);

  if (!result) return null;

  // Calcula período trabalhado
  const calcularPeriodo = () => {
    if (!dadosOriginais) return { anos: 0, meses: 0, dias: 0, totalDias: 0 };
    
    const dataInicio = new Date(dadosOriginais.dataAdmissao);
    const dataFim = new Date(dadosOriginais.dataDemissao);
    
    // Cálculo total de dias
    const totalDias = Math.floor((dataFim.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24));
    
    let anos = dataFim.getFullYear() - dataInicio.getFullYear();
    let meses = dataFim.getMonth() - dataInicio.getMonth();
    let dias = dataFim.getDate() - dataInicio.getDate();
    
    if (dias < 0) {
      meses--;
      dias += new Date(dataFim.getFullYear(), dataFim.getMonth(), 0).getDate();
    }
    
    if (meses < 0) {
      anos--;
      meses += 12;
    }
    
    return { anos, meses, dias, totalDias };
  };

  const periodo = calcularPeriodo();

  // Função para obter nome do motivo de rescisão
  const obterNomeMotivo = (motivo?: string) => {
    const motivos: Record<string, string> = {
      'dispensa_sem_justa_causa': 'Dispensa sem Justa Causa',
      'dispensa_com_justa_causa': 'Dispensa com Justa Causa',
      'pedido_demissao': 'Pedido de Demissão',
      'comum_acordo': 'Comum Acordo',
      'termino_contrato': 'Término do Contrato',
      'aposentadoria': 'Aposentadoria'
    };
    return motivos[motivo || ''] || 'Não informado';
  };

  // Array com todos os itens do resultado
  const resultItems = [
    { label: 'Saldo de Salário', value: result.saldoSalario },
    { label: 'Férias Proporcionais', value: result.feriasPROPorcionais },
    { label: '13º Proporcional', value: result.decimoTerceiroProporcional },
    { label: 'FGTS + Multa', value: result.fgtsMulta },
    ...(result.avisoPrevioIndenizado > 0 
      ? [{ label: 'Aviso Prévio Indenizado', value: result.avisoPrevioIndenizado }] 
      : []),
    ...(result.indenizacaoExperiencia > 0 
      ? [{ label: 'Indenização Contrato Experiência', value: result.indenizacaoExperiencia }] 
      : [])
  ];

  // Título dinâmico baseado no nome
  const cardTitle = nome ? `Resultado - ${nome}` : 'Resultado da Rescisão';

  return (
    <div className="space-y-4 animate-fade-in">
      <Card title={cardTitle}>
        {/* Exibir nome se fornecido */}
        {nome && (
          <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <div className="text-sm text-gray-400 mb-1">Funcionário(a):</div>
            <div className="text-white font-medium">{nome}</div>
          </div>
        )}

        <div className="space-y-4">
          {resultItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
              <span className="text-gray-300 text-sm sm:text-base">{item.label}</span>
              <span className="font-medium text-white text-sm sm:text-base">
                {formatCurrency(item.value)}
              </span>
            </div>
          ))}
          
          <div className="flex justify-between items-center py-3 mt-4 border-t border-gray-600 bg-gray-750 rounded-lg px-4">
            <span className="text-white font-bold text-lg">TOTAL A RECEBER</span>
            <span className="text-emerald-400 font-bold text-xl">
              {formatCurrency(result.total)}
            </span>
          </div>
        </div>

        {/* Botão para mostrar/ocultar memória de cálculo */}
        {dadosOriginais && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <button
              onClick={() => setMostrarCalculos(!mostrarCalculos)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-all duration-200 text-sm font-medium"
            >
              <span className="text-lg">
                {mostrarCalculos ? '📊' : '🧮'}
              </span>
              {mostrarCalculos ? 'Ocultar Memória de Cálculo' : 'Ver Como Foi Calculado'}
              <span className={`transition-transform duration-200 ${mostrarCalculos ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
          </div>
        )}
      </Card>

      {/* Memória de Cálculo */}
      {mostrarCalculos && dadosOriginais && (
        <Card title="📋 Memória de Cálculo Detalhada">
          <div className="space-y-6 text-sm">
            {/* Dados Base */}
            <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/30">
              <h4 className="font-semibold text-gray-200 mb-4 flex items-center gap-2">
                <span className="text-blue-400">📊</span>
                Dados Base do Cálculo
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-400">Salário Mensal:</span>
                    <span className="text-white ml-2 font-medium">{formatCurrency(dadosOriginais.salarioMensal)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Tipo de Contrato:</span>
                    <span className="text-white ml-2 font-medium">
                      {dadosOriginais.tipoContrato === 'experiencia' ? 'Experiência' : 'Normal'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Motivo da Rescisão:</span>
                    <span className="text-white ml-2 font-medium">
                      {obterNomeMotivo(dadosOriginais.motivoRescisao)}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-400">Período Trabalhado:</span>
                    <span className="text-white ml-2 font-medium">
                      {dadosOriginais.tipoContrato === 'experiencia' && dadosOriginais.tempoContrato
                        ? `${dadosOriginais.tempoContrato} dias`
                        : `${periodo.anos} ano(s), ${periodo.meses} mês(es), ${periodo.dias} dia(s)`
                      }
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">FGTS:</span>
                    <span className="text-white ml-2 font-medium">{dadosOriginais.temFGTS ? 'Sim' : 'Não'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Aviso Prévio:</span>
                    <span className="text-white ml-2 font-medium">
                      {dadosOriginais.avisoPrevio === 'indenizado' ? 'Indenizado' : 
                       dadosOriginais.avisoPrevio === 'trabalhado' ? 'Trabalhado' : 'Não Aplicável'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cálculo Saldo de Salário */}
            {result.saldoSalario > 0 && (
              <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/30">
                <h4 className="font-semibold text-gray-200 mb-3 flex items-center gap-2">
                  <span className="text-green-400">💰</span>
                  Saldo de Salário
                </h4>
                <div className="space-y-3">
                  <div className="bg-gray-900/50 p-3 rounded border border-gray-600/30">
                    <div className="text-gray-300 mb-2">
                      <strong>Fórmula:</strong> Dias trabalhados no último mês × (Salário ÷ 30 dias)
                    </div>
                    <div className="text-gray-400 text-xs mb-2">
                      Proporcional aos dias trabalhados no mês da demissão
                    </div>
                    <div className="text-emerald-400 font-medium">
                      <strong>Resultado:</strong> {formatCurrency(result.saldoSalario)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cálculo Férias Proporcionais */}
            {result.feriasPROPorcionais > 0 && (
              <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/30">
                <h4 className="font-semibold text-gray-200 mb-3 flex items-center gap-2">
                  <span className="text-blue-400">🏖️</span>
                  Férias Proporcionais
                </h4>
                <div className="space-y-3">
                  <div className="bg-gray-900/50 p-3 rounded border border-gray-600/30">
                    <div className="text-gray-300 mb-2">
                      <strong>Fórmula:</strong> 
                      {dadosOriginais.tipoContrato === 'experiencia' && dadosOriginais.tempoContrato
                        ? ` ${dadosOriginais.tempoContrato} dias × (${formatCurrency(dadosOriginais.salarioMensal)} ÷ 30) × (1/12) + 1/3`
                        : ` ${periodo.meses + (periodo.dias > 14 ? 1 : 0)} mês(es) × (${formatCurrency(dadosOriginais.salarioMensal)} ÷ 12) + 1/3`
                      }
                    </div>
                    <div className="text-gray-400 text-xs mb-2">
                      {dadosOriginais.tipoContrato === 'experiencia' 
                        ? 'Para contrato de experiência: proporcional aos dias trabalhados + 1/3 constitucional'
                        : 'Férias proporcionais + 1/3 constitucional (frações acima de 14 dias = mês completo)'
                      }
                    </div>
                    <div className="text-blue-400 font-medium">
                      <strong>Resultado:</strong> {formatCurrency(result.feriasPROPorcionais)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cálculo 13º Proporcional */}
            {result.decimoTerceiroProporcional > 0 && (
              <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/30">
                <h4 className="font-semibold text-gray-200 mb-3 flex items-center gap-2">
                  <span className="text-yellow-400">🎁</span>
                  13º Salário Proporcional
                </h4>
                <div className="space-y-3">
                  <div className="bg-gray-900/50 p-3 rounded border border-gray-600/30">
                    <div className="text-gray-300 mb-2">
                      <strong>Fórmula:</strong>
                      {dadosOriginais.tipoContrato === 'experiencia' && dadosOriginais.tempoContrato
                        ? ` ${dadosOriginais.tempoContrato} dias × (${formatCurrency(dadosOriginais.salarioMensal)} ÷ 30) × (1/12)`
                        : ` ${periodo.meses + (periodo.dias > 14 ? 1 : 0)} mês(es) × (${formatCurrency(dadosOriginais.salarioMensal)} ÷ 12)`
                      }
                    </div>
                    <div className="text-gray-400 text-xs mb-2">
                      {dadosOriginais.tipoContrato === 'experiencia' 
                        ? 'Para contrato de experiência: proporcional aos dias trabalhados'
                        : 'Considera frações superiores a 14 dias como mês completo'
                      }
                    </div>
                    <div className="text-yellow-400 font-medium">
                      <strong>Resultado:</strong> {formatCurrency(result.decimoTerceiroProporcional)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cálculo FGTS + Multa */}
            {result.fgtsMulta > 0 && (
              <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/30">
                <h4 className="font-semibold text-gray-200 mb-3 flex items-center gap-2">
                  <span className="text-purple-400">🏦</span>
                  FGTS + Multa
                </h4>
                <div className="space-y-3">
                  <div className="bg-gray-900/50 p-3 rounded border border-gray-600/30">
                    <div className="text-gray-300 mb-2">
                      <strong>Cálculo do FGTS:</strong> 8% do salário × meses trabalhados
                    </div>
                    <div className="text-gray-300 mb-2">
                      <strong>Multa FGTS:</strong> 
                      {dadosOriginais.motivoRescisao === 'dispensa_sem_justa_causa' ? ' 40% sobre o FGTS depositado' :
                       dadosOriginais.motivoRescisao === 'comum_acordo' ? ' 20% sobre o FGTS depositado' :
                       ' Não aplicável para este tipo de rescisão'}
                    </div>
                    <div className="text-gray-400 text-xs mb-2">
                      {dadosOriginais.motivoRescisao === 'dispensa_sem_justa_causa' 
                        ? 'Multa de 40% aplicável para dispensa sem justa causa'
                        : dadosOriginais.motivoRescisao === 'comum_acordo'
                        ? 'Multa de 20% aplicável para rescisão por comum acordo'  
                        : 'Sem direito à multa para pedido de demissão ou justa causa'
                      }
                    </div>
                    <div className="text-purple-400 font-medium">
                      <strong>Resultado:</strong> {formatCurrency(result.fgtsMulta)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cálculo Aviso Prévio */}
            {result.avisoPrevioIndenizado > 0 && (
              <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/30">
                <h4 className="font-semibold text-gray-200 mb-3 flex items-center gap-2">
                  <span className="text-orange-400">⏰</span>
                  Aviso Prévio Indenizado
                </h4>
                <div className="space-y-3">
                  <div className="bg-gray-900/50 p-3 rounded border border-gray-600/30">
                    <div className="text-gray-300 mb-2">
                      <strong>Fórmula:</strong> 30 dias + 3 dias por ano trabalhado
                    </div>
                    <div className="text-gray-300 mb-2">
                      <strong>Cálculo:</strong> {Math.min(30 + (periodo.anos * 3), 90)} dias × ({formatCurrency(dadosOriginais.salarioMensal)} ÷ 30)
                    </div>
                    <div className="text-gray-400 text-xs mb-2">
                      Máximo de 90 dias conforme Lei 12.506/2011. Anos: {periodo.anos}
                    </div>
                    <div className="text-orange-400 font-medium">
                      <strong>Resultado:</strong> {formatCurrency(result.avisoPrevioIndenizado)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Indenização Contrato de Experiência */}
            {result.indenizacaoExperiencia > 0 && (
              <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/30">
                <h4 className="font-semibold text-gray-200 mb-3 flex items-center gap-2">
                  <span className="text-red-400">⚖️</span>
                  Indenização Contrato de Experiência
                </h4>
                <div className="space-y-3">
                  <div className="bg-gray-900/50 p-3 rounded border border-gray-600/30">
                    <div className="text-gray-300 mb-2">
                      <strong>Fórmula:</strong> 50% do salário pelos dias restantes do contrato
                    </div>
                    <div className="text-gray-400 text-xs mb-2">
                      Aplicável quando a empresa dispensa antes do término do contrato de experiência sem justa causa
                    </div>
                    <div className="text-red-400 font-medium">
                      <strong>Resultado:</strong> {formatCurrency(result.indenizacaoExperiencia)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Resumo Final */}
            <div className="bg-emerald-900/20 p-4 rounded-lg border border-emerald-800/30">
              <h4 className="font-semibold text-emerald-400 mb-4 flex items-center gap-2">
                <span>📋</span>
                Resumo e Observações Legais
              </h4>
              <div className="text-gray-300 text-xs leading-relaxed space-y-3">
                <div className="p-3 bg-gray-800/50 rounded border border-gray-700/30">
                  <p className="mb-2">
                    <strong className="text-emerald-400">⚖️ Base Legal:</strong> Os cálculos seguem a Consolidação das Leis do Trabalho (CLT), 
                    Lei 8.036/90 (FGTS), Lei 12.506/2011 (Aviso Prévio) e legislação trabalhista vigente.
                  </p>
                </div>
                
                <div className="p-3 bg-yellow-900/20 rounded border border-yellow-800/30">
                  <p className="mb-2">
                    <strong className="text-yellow-400">⚠️ Observação Importante:</strong> Este é um cálculo estimativo para orientação. 
                    Para valores exatos e oficiais, consulte um advogado trabalhista ou contador especializado.
                  </p>
                </div>

                <div className="p-3 bg-blue-900/20 rounded border border-blue-800/30">
                  <p className="mb-2">
                    <strong className="text-blue-400">💼 Descontos Aplicáveis:</strong> Alguns valores podem sofrer descontos de:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>INSS (Previdência Social) - conforme tabela vigente</li>
                    <li>Imposto de Renda Retido na Fonte (IRRF) - se aplicável</li>
                    <li>Pensão alimentícia - se houver determinação judicial</li>
                  </ul>
                </div>

                <div className="p-3 bg-gray-800/50 rounded border border-gray-700/30">
                  <p className="mb-2">
                    <strong className="text-gray-300">📞 Dúvidas?</strong> Em caso de divergências com o empregador ou dúvidas sobre seus direitos, 
                    procure o sindicato da sua categoria, Ministério Público do Trabalho ou um advogado trabalhista.
                  </p>
                </div>
              </div>
            </div>

            {/* Botão para ocultar */}
            <div className="text-center pt-4">
              <button
                onClick={() => setMostrarCalculos(false)}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-colors text-sm"
              >
                Ocultar Memória de Cálculo ▲
              </button>
            </div>
          </div>
        </Card>
      )}
      
      {/* Ad Space */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
        <div className="text-gray-400 text-sm mb-2"></div>
        <div className="bg-gray-700 rounded h-32 flex items-center justify-center">
          <span className="text-gray-500 text-sm">
            <AdsterraAd />
          </span>
        </div>
      </div>
    </div>
  );
};