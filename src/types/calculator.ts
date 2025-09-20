export type MotivoRescisao = 
  | 'comum_acordo'
  | 'dispensa_sem_justa_causa'
  | 'dispensa_com_justa_causa'
  | 'pedido_demissao'
  | 'aposentadoria'
  | 'falecimento_empregador';

export interface CalculatorFormData {
  nome?: string; // Campo opcional para o nome do funcionário
  salarioMensal: number;
  dataAdmissao: string;
  dataDemissao: string;
  temFGTS: boolean;
  avisoPrevio: 'trabalhado' | 'indenizado' | 'nao_aplicavel';
  tipoContrato: 'normal' | 'experiencia';
  motivoRescisao: MotivoRescisao; // Atualizado para incluir todos os motivos CLT
  tempoContrato: number;
}

export interface CalculationResult {
  saldoSalario: number;
  feriasPROPorcionais: number;
  decimoTerceiroProporcional: number;
  fgtsMulta: number;
  avisoPrevioIndenizado: number;
  indenizacaoExperiencia: number;
  total: number;
  // Novos campos para detalhar os direitos
  seguroDesemprego: boolean;
  podeMovimentarFGTS: boolean;
  observacoes: string[];
}

export interface CalculatorProps {
  onCalculate?: (result: CalculationResult) => void;
}

export interface ExportData {
  formData: CalculatorFormData;
  result: CalculationResult;
  calculatedAt: string;
}

// Definições dos motivos de rescisão conforme CLT
export interface MotivoRescisaoInfo {
  id: MotivoRescisao;
  nome: string;
  descricao: string;
  direitos: {
    saldoSalario: boolean;
    ferias: boolean;
    decimoTerceiro: boolean;
    avisoPrevio: boolean;
    fgts: boolean;
    multaFgts: boolean;
    seguroDesemprego: boolean;
  };
  observacoes: string[];
  multaFgtsPercentual?: number; // Para casos especiais como comum acordo
  fgtsAcessivel?: number; // Percentual do FGTS acessível (ex: 80% no comum acordo)
}

export const MOTIVOS_RESCISAO: Record<MotivoRescisao, MotivoRescisaoInfo> = {
  comum_acordo: {
    id: 'comum_acordo',
    nome: 'Demissão em Comum Acordo',
    descricao: 'Acordo entre empregado e empregador para rescisão do contrato (Lei 13.467/2017)',
    direitos: {
      saldoSalario: true,
      ferias: true,
      decimoTerceiro: true,
      avisoPrevio: true,
      fgts: true,
      multaFgts: true,
      seguroDesemprego: false
    },
    multaFgtsPercentual: 20, // 20% ao invés de 40%
    fgtsAcessivel: 80, // Pode sacar 80% do FGTS
    observacoes: [
      'Aviso prévio reduzido pela metade',
      'Multa do FGTS de 20% (metade dos 40%)',
      'Permite saque de 80% do FGTS',
      'Não tem direito ao seguro-desemprego'
    ]
  },
  dispensa_sem_justa_causa: {
    id: 'dispensa_sem_justa_causa',
    nome: 'Dispensa sem Justa Causa',
    descricao: 'Demissão por iniciativa do empregador sem motivo disciplinar',
    direitos: {
      saldoSalario: true,
      ferias: true,
      decimoTerceiro: true,
      avisoPrevio: true,
      fgts: true,
      multaFgts: true,
      seguroDesemprego: true
    },
    multaFgtsPercentual: 40,
    fgtsAcessivel: 100,
    observacoes: [
      'Direito a todos os benefícios',
      'Multa de 40% sobre o saldo do FGTS',
      'Pode sacar todo o FGTS',
      'Tem direito ao seguro-desemprego'
    ]
  },
  dispensa_com_justa_causa: {
    id: 'dispensa_com_justa_causa',
    nome: 'Dispensa com Justa Causa',
    descricao: 'Demissão por falta grave do empregado conforme Art. 482 da CLT',
    direitos: {
      saldoSalario: true,
      ferias: false, // apenas se já vencidas
      decimoTerceiro: false,
      avisoPrevio: false,
      fgts: false,
      multaFgts: false,
      seguroDesemprego: false
    },
    multaFgtsPercentual: 0,
    fgtsAcessivel: 0,
    observacoes: [
      'Apenas saldo de salário',
      'Férias apenas se já vencidas (período aquisitivo completo)',
      'Não há direito ao 13º proporcional',
      'Não pode sacar o FGTS nem receber multa',
      'Não tem direito ao seguro-desemprego'
    ]
  },
  pedido_demissao: {
    id: 'pedido_demissao',
    nome: 'Pedido de Demissão',
    descricao: 'Rescisão por iniciativa do empregado',
    direitos: {
      saldoSalario: true,
      ferias: true,
      decimoTerceiro: true,
      avisoPrevio: false, // empregado deve cumprir ou indenizar
      fgts: false,
      multaFgts: false,
      seguroDesemprego: false
    },
    multaFgtsPercentual: 0,
    fgtsAcessivel: 0,
    observacoes: [
      'Empregado deve cumprir aviso prévio ou indenizar',
      'Não pode sacar o FGTS (salvo casos específicos)',
      'Não recebe multa do FGTS',
      'Não tem direito ao seguro-desemprego'
    ]
  },
  aposentadoria: {
    id: 'aposentadoria',
    nome: 'Aposentadoria do Empregado',
    descricao: 'Rescisão por aposentadoria espontânea ou compulsória',
    direitos: {
      saldoSalario: true,
      ferias: true,
      decimoTerceiro: true,
      avisoPrevio: false,
      fgts: true,
      multaFgts: false,
      seguroDesemprego: false
    },
    multaFgtsPercentual: 0,
    fgtsAcessivel: 100,
    observacoes: [
      'Pode sacar todo o FGTS',
      'Não recebe multa do FGTS',
      'Não tem direito ao seguro-desemprego',
      'Aposentadoria espontânea extingue o contrato'
    ]
  },
  falecimento_empregador: {
    id: 'falecimento_empregador',
    nome: 'Falecimento do Empregador',
    descricao: 'Rescisão por morte do empregador pessoa física',
    direitos: {
      saldoSalario: true,
      ferias: true,
      decimoTerceiro: true,
      avisoPrevio: true,
      fgts: true,
      multaFgts: true,
      seguroDesemprego: true
    },
    multaFgtsPercentual: 40,
    fgtsAcessivel: 100,
    observacoes: [
      'Equipara-se à dispensa sem justa causa',
      'Direito a todos os benefícios',
      'Multa de 40% sobre o FGTS',
      'Tem direito ao seguro-desemprego'
    ]
  }
};

// Função auxiliar para obter informações do motivo
export function getMotivoInfo(motivo: MotivoRescisao): MotivoRescisaoInfo {
  return MOTIVOS_RESCISAO[motivo];
}

// Função auxiliar para obter lista de motivos para select
export function getMotivosOptions(): Array<{ value: MotivoRescisao; label: string }> {
  return Object.values(MOTIVOS_RESCISAO).map(motivo => ({
    value: motivo.id,
    label: motivo.nome
  }));
}