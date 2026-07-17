'use client';

import { CalculationResult } from '@/types/calculator';
import { Card } from '@/components/ui/Card';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  FileText,
  ChevronDown,
  ChevronUp,
  Info,
  Banknote,
  Umbrella,
  Gift,
  Landmark,
  Clock,
  TrendingDown,
  Scale,
  BarChart2,
  ClipboardList,
} from 'lucide-react';
import { GoogleAd } from '@/components/GoogleAd';
import { LeadGenCard } from '@/components/LeadGenCard';

interface ResultDisplayProps {
  result: CalculationResult | null;
  nome?: string;
  dadosOriginais?: {
    salarioMensal: number;
    comissoes?: number;
    adicionaisHabituais?: number;
    dataAdmissao: string;
    dataDemissao: string;
    tipoContrato: string;
    motivoRescisao?: string;
    tempoContrato?: number;
    avisoPrevio?: string;
    temFGTS: boolean;
    temEstabilidade?: boolean;
    tipoEstabilidade?: string;
    numeroDependentesIR?: number;
  };
}

const DOCUMENTOS_POR_MOTIVO: Record<string, string[]> = {
  dispensa_sem_justa_causa: [
    'Termo de Rescisão do Contrato de Trabalho (TRCT) assinado',
    'Guia para Levantamento do FGTS (GRF / extrato FGTS)',
    'Carta de demissão assinada pelo empregador',
    'Carteira de Trabalho (CTPS) anotada com data de saída',
    'Chave para saque do FGTS (Caixa Econômica Federal)',
    'CD/SD (Comunicação de Dispensa) para requerer Seguro Desemprego',
    'Último holerite (comprovante de pagamento)',
    'Recibo de quitação do aviso prévio (se indenizado)',
    'Declaração de informes de rendimento (para IR)',
  ],
  dispensa_com_justa_causa: [
    'Termo de Rescisão do Contrato de Trabalho (TRCT)',
    'Carta de demissão por justa causa com descrição do motivo',
    'Carteira de Trabalho (CTPS) anotada com data de saída',
    'Extrato do FGTS (para consulta do saldo, sem saque)',
    'Último holerite',
    'ATENÇÃO: Guarde toda a documentação — você pode contestar a justa causa na Justiça do Trabalho',
  ],
  pedido_demissao: [
    'Termo de Rescisão do Contrato de Trabalho (TRCT)',
    'Carta de pedido de demissão (assinada por você)',
    'Carteira de Trabalho (CTPS) anotada',
    'Extrato do FGTS',
    'Último holerite',
    'Recibo de cumprimento ou indenização do aviso prévio',
  ],
  comum_acordo: [
    'Termo de Rescisão do Contrato de Trabalho (TRCT)',
    'Acordo escrito assinado pelas duas partes',
    'Guia para Levantamento do FGTS (80% do saldo)',
    'Carteira de Trabalho (CTPS) anotada',
    'Comprovante do pagamento das verbas rescisórias',
    'Último holerite',
  ],
  termino_contrato: [
    'Termo de Rescisão do Contrato de Trabalho (TRCT)',
    'Contrato de trabalho por prazo determinado',
    'Carteira de Trabalho (CTPS) anotada',
    'Guia para Levantamento do FGTS',
    'Último holerite',
  ],
  aposentadoria: [
    'Termo de Rescisão do Contrato de Trabalho (TRCT)',
    'Comprovante de concessão da aposentadoria (INSS)',
    'Carteira de Trabalho (CTPS) anotada',
    'Guia para Levantamento do FGTS',
    'Último holerite',
  ],
};

const obterNomeMotivo = (motivo?: string) => {
  const motivos: Record<string, string> = {
    dispensa_sem_justa_causa: 'Dispensa sem Justa Causa',
    dispensa_com_justa_causa: 'Dispensa com Justa Causa',
    pedido_demissao: 'Pedido de Demissão',
    comum_acordo: 'Comum Acordo',
    termino_contrato: 'Término do Contrato',
    aposentadoria: 'Aposentadoria',
  };
  return motivos[motivo || ''] || 'Não informado';
};

export const ResultDisplay = ({ result, nome, dadosOriginais }: ResultDisplayProps) => {
  const [mostrarCalculos, setMostrarCalculos] = useState(false);
  const [mostrarChecklist, setMostrarChecklist] = useState(false);
  const [mostrarDeducoes, setMostrarDeducoes] = useState(true);

  if (!result) return null;

  const calcularPeriodo = () => {
    if (!dadosOriginais || dadosOriginais.tipoContrato === 'experiencia') return { anos: 0, meses: 0, dias: 0, totalDias: 0 };

    const dataInicio = new Date(dadosOriginais.dataAdmissao);
    const dataFim = new Date(dadosOriginais.dataDemissao);

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
  const cardTitle = nome ? `Resultado — ${nome}` : 'Resultado da Rescisão';
  const prazoFormatado = result.prazoLimitePagamento
    ? formatDate(result.prazoLimitePagamento)
    : null;

  const documentos =
    dadosOriginais?.motivoRescisao
      ? DOCUMENTOS_POR_MOTIVO[dadosOriginais.motivoRescisao] ?? DOCUMENTOS_POR_MOTIVO.dispensa_sem_justa_causa
      : DOCUMENTOS_POR_MOTIVO.dispensa_sem_justa_causa;

  const resultItems = [
    { label: 'Saldo de Salário', value: result.saldoSalario, color: 'text-green-400' },
    ...(result.feriasVencidas > 0
      ? [{ label: 'Férias Vencidas + 1/3', value: result.feriasVencidas, color: 'text-cyan-400' }]
      : []),
    { label: 'Férias Proporcionais + 1/3', value: result.feriasPROPorcionais, color: 'text-blue-400' },
    { label: '13º Proporcional', value: result.decimoTerceiroProporcional, color: 'text-yellow-400' },
    { label: 'FGTS + Multa', value: result.fgtsMulta, color: 'text-purple-400' },
    ...(result.avisoPrevioIndenizado > 0
      ? [{ label: 'Aviso Prévio Indenizado', value: result.avisoPrevioIndenizado, color: 'text-orange-400' }]
      : []),
    ...(result.indenizacaoExperiencia > 0
      ? [{ label: 'Indenização Contrato Experiência', value: result.indenizacaoExperiencia, color: 'text-red-400' }]
      : []),
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Alerta estabilidade */}
      {result.alertaEstabilidade && (
        <div className="p-4 bg-red-900/30 border border-red-600/50 rounded-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-300 leading-relaxed">{result.alertaEstabilidade}</p>
        </div>
      )}

      {/* Prazo de pagamento */}
      {prazoFormatado && (
        <div className={`p-4 rounded-lg border flex items-start gap-3 ${result.diasParaPagamento < 0
          ? 'bg-red-900/30 border-red-600/50'
          : result.diasParaPagamento <= 3
            ? 'bg-yellow-900/30 border-yellow-600/50'
            : 'bg-blue-900/20 border-blue-700/40'
          }`}>
          <Calendar className={`w-5 h-5 flex-shrink-0 mt-0.5 ${result.diasParaPagamento < 0 ? 'text-red-400' : result.diasParaPagamento <= 3 ? 'text-yellow-400' : 'text-blue-400'}`} />
          <div>
            <p className={`text-sm font-medium ${result.diasParaPagamento < 0 ? 'text-red-300' : result.diasParaPagamento <= 3 ? 'text-yellow-300' : 'text-blue-300'}`}>
              Prazo limite para pagamento: {prazoFormatado}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {result.diasParaPagamento < 0
                ? `Prazo vencido há ${Math.abs(result.diasParaPagamento)} dia(s). O empregador pode dever multa de 1 salário (Art. 477 §8° CLT).`
                : result.diasParaPagamento === 0
                  ? 'Prazo vence hoje! Verifique se o pagamento foi realizado.'
                  : `${result.diasParaPagamento} dia(s) restantes — Art. 477 §6° CLT (10 dias corridos)`}
            </p>
          </div>
        </div>
      )}

      {/* Projeção do aviso prévio indenizado */}
      {result.dataTerminoProjetada && (
        <div className="p-4 bg-emerald-900/20 border border-emerald-700/40 rounded-lg flex items-start gap-3">
          <Info className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-emerald-300">
              Aviso prévio de {result.diasAvisoPrevio} dias projeta o contrato até {formatDate(result.dataTerminoProjetada)}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              O período do aviso indenizado conta como tempo de serviço para férias e 13º (Lei 12.506/2011 + OJ 82 SDI-1 TST).
            </p>
          </div>
        </div>
      )}

      <Card title={cardTitle}>
        {nome && (
          <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <div className="text-xs text-gray-400 mb-0.5">Funcionário(a)</div>
            <div className="text-white font-medium">{nome}</div>
          </div>
        )}

        {/* Verbas brutas */}
        <div className="space-y-1">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Verbas rescisórias (bruto)</p>
          {resultItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700/60 last:border-b-0">
              <span className="text-gray-300 text-sm">{item.label}</span>
              <span className={`font-medium text-sm ${item.color}`}>
                {formatCurrency(item.value)}
              </span>
            </div>
          ))}

          {/* Total bruto */}
          <div className="flex justify-between items-center py-3 mt-2 border-t border-gray-600 px-2 bg-gray-800/30 rounded-lg">
            <span className="text-white font-semibold">Total Bruto</span>
            <span className="text-white font-bold text-lg">{formatCurrency(result.total)}</span>
          </div>
        </div>

        {/* Seção deduções */}
        {(result.deducaoINSS > 0 || result.deducaoIRRF > 0) && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <button
              onClick={() => setMostrarDeducoes(!mostrarDeducoes)}
              className="w-full flex items-center justify-between text-sm font-medium text-gray-300 hover:text-white transition-colors mb-3"
            >
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-400" />
                Deduções estimadas (INSS + IRRF)
              </span>
              {mostrarDeducoes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {mostrarDeducoes && (
              <div className="space-y-2 mb-3">
                <div className="p-2 bg-blue-900/10 border border-blue-800/20 rounded text-xs text-blue-300">
                  Férias indenizadas são isentas de IRRF (Lei 7.713/88, art. 6°, V). O INSS é calculado progressivamente. Valores estimados — consulte a folha de rescisão oficial.
                </div>
                {result.deducaoINSS > 0 && (
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-gray-400 text-sm">INSS (Previdência Social)</span>
                    <span className="text-red-400 font-medium text-sm">- {formatCurrency(result.deducaoINSS)}</span>
                  </div>
                )}
                {result.deducaoIRRF > 0 && (
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-gray-400 text-sm">IRRF (Imposto de Renda)</span>
                    <span className="text-red-400 font-medium text-sm">- {formatCurrency(result.deducaoIRRF)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Total líquido */}
            <div className="flex justify-between items-center py-3 px-3 bg-emerald-900/20 border border-emerald-700/30 rounded-lg">
              <div>
                <span className="text-white font-bold text-base">Estimativa Líquida</span>
                <p className="text-xs text-gray-400 mt-0.5">Após INSS e IRRF estimados</p>
              </div>
              <span className="text-emerald-400 font-bold text-xl">{formatCurrency(result.totalLiquido)}</span>
            </div>
          </div>
        )}

        {/* Seguro Desemprego */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Seguro Desemprego</p>
          {result.seguroDesemprego.temDireito ? (
            <div className="p-3 bg-emerald-900/20 border border-emerald-700/40 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-medium text-sm">Você tem direito ao Seguro Desemprego</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center mt-3">
                <div className="bg-gray-800/50 p-2 rounded">
                  <p className="text-xs text-gray-400">Parcelas</p>
                  <p className="text-white font-bold text-lg">{result.seguroDesemprego.numeroParcelas}</p>
                </div>
                <div className="bg-gray-800/50 p-2 rounded">
                  <p className="text-xs text-gray-400">Valor/parcela</p>
                  <p className="text-emerald-400 font-bold text-sm">{formatCurrency(result.seguroDesemprego.valorEstimadoParcela)}</p>
                </div>
                <div className="bg-gray-800/50 p-2 rounded">
                  <p className="text-xs text-gray-400">Total estimado</p>
                  <p className="text-emerald-400 font-bold text-sm">{formatCurrency(result.seguroDesemprego.totalEstimado)}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">Solicite via app Carteira de Trabalho Digital (CTPS Digital) ou nas agências SINE/MTE.</p>
            </div>
          ) : (
            <div className="p-3 bg-gray-800/30 border border-gray-700/50 rounded-lg flex items-start gap-2">
              <XCircle className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-400">{result.seguroDesemprego.motivoNaoDireito || 'Sem direito ao seguro desemprego neste tipo de rescisão.'}</p>
            </div>
          )}
        </div>

        {/* FGTS detalhado (se houver multa) */}
        {result.saldoFGTS > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Detalhamento FGTS</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Saldo FGTS estimado</span>
                <span className="text-gray-300">{formatCurrency(result.saldoFGTS)}</span>
              </div>
              {result.multaFGTS > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Multa sobre FGTS</span>
                  <span className="text-purple-400">{formatCurrency(result.multaFGTS)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-medium border-t border-gray-700 pt-1.5">
                <span className="text-gray-300">Total FGTS + Multa</span>
                <span className="text-purple-400">{formatCurrency(result.fgtsMulta)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Botões expand */}
        {dadosOriginais && (
          <div className="mt-4 pt-4 border-t border-gray-700 space-y-2">
            <button
              onClick={() => setMostrarChecklist(!mostrarChecklist)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-700/40 hover:bg-gray-700/70 text-gray-300 hover:text-white rounded-lg transition-all text-sm font-medium"
            >
              <FileText className="w-4 h-4" />
              {mostrarChecklist ? 'Ocultar' : 'Ver'} Documentos a Solicitar
              {mostrarChecklist ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setMostrarCalculos(!mostrarCalculos)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-700/40 hover:bg-gray-700/70 text-gray-300 hover:text-white rounded-lg transition-all text-sm font-medium"
            >
              <BarChart2 className="w-4 h-4" />
              {mostrarCalculos ? 'Ocultar Memória de Cálculo' : 'Ver Como Foi Calculado'}
              {mostrarCalculos ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        )}
      </Card>

      {/* Checklist de documentos */}
      {mostrarChecklist && (
        <Card title="Documentos a Solicitar ao Empregador">
          <p className="text-xs text-gray-400 mb-3">
            Motivo: <span className="text-gray-300 font-medium">{obterNomeMotivo(dadosOriginais?.motivoRescisao)}</span>
          </p>
          <ul className="space-y-2">
            {documentos.map((doc, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className={doc.startsWith('ATENÇÃO') ? 'text-yellow-300 font-medium' : 'text-gray-300'}>{doc}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700/30 rounded text-xs text-blue-300">
            O prazo para pagamento das verbas e entrega dos documentos é de 10 dias corridos após o término do contrato (Art. 477 CLT). Guarde todas as vias com autenticação.
          </div>
        </Card>
      )}

      {/* Memória de Cálculo */}
      {mostrarCalculos && dadosOriginais && (
        <Card title="Memória de Cálculo Detalhada">
          <div className="space-y-5 text-sm">
            {/* Dados Base */}
            <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/30">
              <h4 className="font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-blue-400" /> Dados Base
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div><span className="text-gray-400">Salário base:</span> <span className="text-white ml-1">{formatCurrency(dadosOriginais.salarioMensal)}</span></div>
                {(dadosOriginais.comissoes ?? 0) > 0 && (
                  <div><span className="text-gray-400">Comissões:</span> <span className="text-white ml-1">{formatCurrency(dadosOriginais.comissoes ?? 0)}</span></div>
                )}
                {(dadosOriginais.adicionaisHabituais ?? 0) > 0 && (
                  <div><span className="text-gray-400">Adicionais:</span> <span className="text-white ml-1">{formatCurrency(dadosOriginais.adicionaisHabituais ?? 0)}</span></div>
                )}
                <div><span className="text-gray-400">Contrato:</span> <span className="text-white ml-1">{dadosOriginais.tipoContrato === 'experiencia' ? 'Experiência' : 'Normal'}</span></div>
                <div><span className="text-gray-400">Motivo:</span> <span className="text-white ml-1">{obterNomeMotivo(dadosOriginais.motivoRescisao)}</span></div>
                <div>
                  <span className="text-gray-400">Período:</span>
                  <span className="text-white ml-1">
                    {dadosOriginais.tipoContrato === 'experiencia' && dadosOriginais.tempoContrato
                      ? `${dadosOriginais.tempoContrato} dias`
                      : `${periodo.anos}a ${periodo.meses}m ${periodo.dias}d`}
                  </span>
                </div>
              </div>
            </div>

            {/* Saldo Salário */}
            {result.saldoSalario > 0 && (
              <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/30">
                <h4 className="font-semibold text-gray-200 mb-2 flex items-center gap-2"><Banknote className="w-4 h-4 text-green-400" /> Saldo de Salário</h4>
                <p className="text-xs text-gray-400 mb-1">Dias trabalhados no último mês × (salário ÷ 30)</p>
                <p className="text-green-400 font-medium">{formatCurrency(result.saldoSalario)}</p>
              </div>
            )}

            {/* Férias */}
            {result.feriasPROPorcionais > 0 && (
              <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/30">
                <h4 className="font-semibold text-gray-200 mb-2 flex items-center gap-2"><Umbrella className="w-4 h-4 text-blue-400" /> Férias Proporcionais</h4>
                <p className="text-xs text-gray-400 mb-1">
                  {dadosOriginais.tipoContrato === 'experiencia'
                    ? 'Dias trabalhados ÷ 360 × salário × (1 + 1/3)'
                    : `${periodo.meses + (periodo.dias > 14 ? 1 : 0)} mês(es) ÷ 12 × salário × (1 + 1/3) | Férias indenizadas são isentas de IRRF`}
                </p>
                <p className="text-blue-400 font-medium">{formatCurrency(result.feriasPROPorcionais)}</p>
              </div>
            )}

            {/* 13° */}
            {result.decimoTerceiroProporcional > 0 && (
              <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/30">
                <h4 className="font-semibold text-gray-200 mb-2 flex items-center gap-2"><Gift className="w-4 h-4 text-yellow-400" /> 13° Proporcional</h4>
                <p className="text-xs text-gray-400 mb-1">
                  {dadosOriginais.tipoContrato === 'experiencia'
                    ? 'Dias trabalhados ÷ 360 × salário'
                    : `${periodo.meses + (periodo.dias > 14 ? 1 : 0)} mês(es) ÷ 12 × salário`}
                </p>
                <p className="text-yellow-400 font-medium">{formatCurrency(result.decimoTerceiroProporcional)}</p>
              </div>
            )}

            {/* FGTS */}
            {result.fgtsMulta > 0 && (
              <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/30">
                <h4 className="font-semibold text-gray-200 mb-2 flex items-center gap-2"><Landmark className="w-4 h-4 text-purple-400" /> FGTS + Multa</h4>
                <div className="text-xs text-gray-400 space-y-1 mb-2">
                  <p>Saldo estimado: 8% × salário × meses + 8% × 13° + 8% × aviso prévio</p>
                  <p>Multa: {dadosOriginais.motivoRescisao === 'dispensa_sem_justa_causa' ? '40%' : dadosOriginais.motivoRescisao === 'comum_acordo' ? '20%' : '0%'} sobre o saldo FGTS</p>
                </div>
                <div className="flex justify-between text-xs text-gray-300 mb-1">
                  <span>Saldo FGTS: {formatCurrency(result.saldoFGTS)}</span>
                  <span>Multa: {formatCurrency(result.multaFGTS)}</span>
                </div>
                <p className="text-purple-400 font-medium">{formatCurrency(result.fgtsMulta)}</p>
              </div>
            )}

            {/* Aviso Prévio */}
            {result.avisoPrevioIndenizado > 0 && (
              <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/30">
                <h4 className="font-semibold text-gray-200 mb-2 flex items-center gap-2"><Clock className="w-4 h-4 text-orange-400" /> Aviso Prévio Indenizado</h4>
                <p className="text-xs text-gray-400 mb-1">
                  30 dias + 3 dias × {periodo.anos} anos = {Math.min(30 + periodo.anos * 3, 90)} dias × (salário ÷ 30)
                  {dadosOriginais.motivoRescisao === 'comum_acordo' ? ' × 50% (comum acordo)' : ''}
                  | Base Legal: Lei 12.506/2011
                </p>
                <p className="text-orange-400 font-medium">{formatCurrency(result.avisoPrevioIndenizado)}</p>
              </div>
            )}

            {/* Deduções */}
            {(result.deducaoINSS > 0 || result.deducaoIRRF > 0) && (
              <div className="bg-red-900/10 p-4 rounded-lg border border-red-800/30">
                <h4 className="font-semibold text-red-300 mb-2 flex items-center gap-2"><TrendingDown className="w-4 h-4" /> Deduções Estimadas</h4>
                <div className="text-xs text-gray-400 space-y-1">
                  <p>Base INSS: saldo + 13° + aviso prévio + base férias (sem 1/3)</p>
                  <p>Base IRRF: saldo + 13° + aviso prévio − INSS (férias isentas - Lei 7.713/88)</p>
                  {dadosOriginais.numeroDependentesIR && dadosOriginais.numeroDependentesIR > 0 && (
                    <p>Dedução dependentes IR: {dadosOriginais.numeroDependentesIR} × R$ 189,59 = {formatCurrency(dadosOriginais.numeroDependentesIR * 189.59)}</p>
                  )}
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-300">INSS: <span className="text-red-400">- {formatCurrency(result.deducaoINSS)}</span></span>
                  <span className="text-gray-300">IRRF: <span className="text-red-400">- {formatCurrency(result.deducaoIRRF)}</span></span>
                </div>
              </div>
            )}

            {/* Observações legais */}
            <div className="bg-emerald-900/20 p-4 rounded-lg border border-emerald-800/30">
              <h4 className="font-semibold text-emerald-400 mb-3 flex items-center gap-2"><Scale className="w-4 h-4" /> Base Legal e Observações</h4>
              <div className="text-xs text-gray-300 space-y-2">
                <p>• CLT (Decreto-Lei 5.452/43) — regras gerais de rescisão</p>
                <p>• Lei 8.036/90 — FGTS</p>
                <p>• Lei 12.506/2011 — Aviso Prévio Proporcional</p>
                <p>• Lei 13.467/2017 (Reforma Trabalhista) — Comum Acordo</p>
                <p>• Lei 7.713/88, art. 6°, V — Isenção IRRF férias indenizadas</p>
                <p className="text-yellow-300 mt-2 flex items-start gap-1.5"><AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> Este é um cálculo estimativo. Valores exatos devem ser verificados na folha de rescisão emitida pelo empregador. Consulte um advogado trabalhista para casos específicos.</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Lead Gen — acima dos exports, alta visibilidade */}
      <LeadGenCard motivo={dadosOriginais?.motivoRescisao} />

      {/* Anúncio AdSense — resultado topo */}
      <GoogleAd slot="resultadoTopo" format="rectangle" />

      {/* Anúncio AdSense — resultado meio (após engajamento) */}
      <GoogleAd slot="resultadoMeio" format="horizontal" />
    </div>
  );
};
