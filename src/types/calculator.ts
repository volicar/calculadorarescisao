// types/calculator.ts

export interface CalculatorFormData {
  nome?: string; // Campo opcional para o nome
  salarioMensal: number;
  dataAdmissao: string;
  dataDemissao: string;
  tipoContrato: 'normal' | 'experiencia';
  motivoRescisao?: 'dispensa_sem_justa_causa' | 'dispensa_com_justa_causa' | 'pedido_demissao' | 'comum_acordo' | 'termino_contrato' | 'aposentadoria';
  tempoContrato?: number; // Para contratos de experiência (em dias)
  avisoPrevio?: 'indenizado' | 'trabalhado' | 'nao_aplicavel';
  temFGTS: boolean;
}

export interface CalculationResult {
  saldoSalario: number;
  feriasPROPorcionais: number;
  decimoTerceiroProporcional: number;
  fgtsMulta: number;
  avisoPrevioIndenizado: number;
  indenizacaoExperiencia: number;
  total: number;
}

// Interface para os dados originais usados na memória de cálculo
export interface CalculationInputData {
  salarioMensal: number;
  dataAdmissao: string;
  dataDemissao: string;
  tipoContrato: string;
  motivoRescisao?: string;
  tempoContrato?: number;
  avisoPrevio?: string;
  temFGTS: boolean;
}

// Enum para tipos de contrato
export enum TipoContrato {
  NORMAL = 'normal',
  EXPERIENCIA = 'experiencia'
}

// Enum para motivos de rescisão
export enum MotivoRescisao {
  DISPENSA_SEM_JUSTA_CAUSA = 'dispensa_sem_justa_causa',
  DISPENSA_COM_JUSTA_CAUSA = 'dispensa_com_justa_causa',
  PEDIDO_DEMISSAO = 'pedido_demissao',
  COMUM_ACORDO = 'comum_acordo',
  TERMINO_CONTRATO = 'termino_contrato',
  APOSENTADORIA = 'aposentadoria'
}

// Enum para aviso prévio
export enum AvisoPrevio {
  INDENIZADO = 'indenizado',
  TRABALHADO = 'trabalhado',
  NAO_APLICAVEL = 'nao_aplicavel'
}

// Interface para período trabalhado
export interface PeriodoTrabalhado {
  anos: number;
  meses: number;
  dias: number;
  totalDias: number;
}

// Interface para detalhes do cálculo
export interface CalculationDetails {
  periodoTrabalhado: PeriodoTrabalhado;
  salarioDiario: number;
  valorFGTS: number;
  valorMultaFGTS: number;
  diasAvisoPrevio: number;
  mesesFeriasProporcionais: number;
  meses13Proporcional: number;
}