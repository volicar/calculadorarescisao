// types/calculator.ts

export interface CalculatorFormData {
  nome?: string;
  salarioMensal: number;
  comissoes?: number;
  adicionaisHabituais?: number;
  dataAdmissao: string;
  dataDemissao: string;
  tipoContrato: 'normal' | 'experiencia';
  motivoRescisao?: 'dispensa_sem_justa_causa' | 'dispensa_com_justa_causa' | 'pedido_demissao' | 'comum_acordo' | 'termino_contrato' | 'aposentadoria';
  tempoContrato?: number;
  avisoPrevio?: 'indenizado' | 'trabalhado' | 'nao_aplicavel';
  temFGTS: boolean;
  temEstabilidade?: boolean;
  tipoEstabilidade?: 'gestante' | 'acidente' | 'cipa' | 'sindical' | 'outro';
  numeroDependentesIR?: number;
}

export interface SeguroDesempregoResult {
  temDireito: boolean;
  numeroParcelas: number;
  valorEstimadoParcela: number;
  totalEstimado: number;
  motivoNaoDireito?: string;
}

export interface CalculationResult {
  saldoSalario: number;
  feriasPROPorcionais: number;
  decimoTerceiroProporcional: number;
  fgtsMulta: number;
  avisoPrevioIndenizado: number;
  indenizacaoExperiencia: number;
  total: number;

  // FGTS detalhado
  saldoFGTS: number;
  multaFGTS: number;

  // Deduções estimadas
  deducaoINSS: number;
  deducaoIRRF: number;
  totalLiquido: number;

  // Prazo de pagamento
  prazoLimitePagamento: string;
  diasParaPagamento: number;

  // Seguro desemprego
  seguroDesemprego: SeguroDesempregoResult;

  // Alerta estabilidade
  alertaEstabilidade?: string;
}

export interface CalculationInputData {
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
}

export enum TipoContrato {
  NORMAL = 'normal',
  EXPERIENCIA = 'experiencia'
}

export enum MotivoRescisao {
  DISPENSA_SEM_JUSTA_CAUSA = 'dispensa_sem_justa_causa',
  DISPENSA_COM_JUSTA_CAUSA = 'dispensa_com_justa_causa',
  PEDIDO_DEMISSAO = 'pedido_demissao',
  COMUM_ACORDO = 'comum_acordo',
  TERMINO_CONTRATO = 'termino_contrato',
  APOSENTADORIA = 'aposentadoria'
}

export enum AvisoPrevio {
  INDENIZADO = 'indenizado',
  TRABALHADO = 'trabalhado',
  NAO_APLICAVEL = 'nao_aplicavel'
}

export interface PeriodoTrabalhado {
  anos: number;
  meses: number;
  dias: number;
  totalDias: number;
}

export interface CalculationDetails {
  periodoTrabalhado: PeriodoTrabalhado;
  salarioDiario: number;
  valorFGTS: number;
  valorMultaFGTS: number;
  diasAvisoPrevio: number;
  mesesFeriasProporcionais: number;
  meses13Proporcional: number;
}

export interface HistoricoItem {
  id: string;
  data: string;
  nome?: string;
  salario: number;
  motivo?: string;
  total: number;
  totalLiquido: number;
  formData: CalculatorFormData;
  result: CalculationResult;
}
