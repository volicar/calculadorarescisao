// Seguro Desemprego - Lei 7.998/90 atualizada
// Valores de referência 2025

import { SeguroDesempregoResult } from '@/types/calculator';

const SALARIO_MINIMO_2025 = 1518.00;

// Faixas para cálculo do valor da parcela (2025)
const FAIXAS_SEGURO = [
  { limite: 2041.35, multiplicador: 0.8 },
  { limite: 3402.24, multiplicador: 0.5 },
];

const VALOR_MAXIMO_PARCELA = 2230.97;

const calcularValorParcela = (mediaUltimosSalarios: number): number => {
  let valor = 0;

  if (mediaUltimosSalarios <= FAIXAS_SEGURO[0].limite) {
    valor = mediaUltimosSalarios * FAIXAS_SEGURO[0].multiplicador;
  } else if (mediaUltimosSalarios <= FAIXAS_SEGURO[1].limite) {
    valor =
      FAIXAS_SEGURO[0].limite * FAIXAS_SEGURO[0].multiplicador +
      (mediaUltimosSalarios - FAIXAS_SEGURO[0].limite) * FAIXAS_SEGURO[1].multiplicador;
  } else {
    valor =
      FAIXAS_SEGURO[0].limite * FAIXAS_SEGURO[0].multiplicador +
      (FAIXAS_SEGURO[1].limite - FAIXAS_SEGURO[0].limite) * FAIXAS_SEGURO[1].multiplicador;
  }

  // Mínimo: salário mínimo / Máximo: teto 2025
  return Math.min(Math.max(valor, SALARIO_MINIMO_2025), VALOR_MAXIMO_PARCELA);
};

const calcularNumeroParcelas = (mesesTrabalhados: number, primeiraRequisicao: boolean = true): number => {
  if (primeiraRequisicao) {
    if (mesesTrabalhados >= 24) return 5;
    if (mesesTrabalhados >= 12) return 4;
    return 3;
  } else {
    // Segunda requisição em diante: regras diferentes
    if (mesesTrabalhados >= 24) return 5;
    if (mesesTrabalhados >= 12) return 4;
    return 3;
  }
};

export const calcularSeguroDesemprego = (params: {
  motivoRescisao?: string;
  mesesTrabalhados: number;
  salarioMensal: number;
  tipoContrato: string;
}): SeguroDesempregoResult => {
  const { motivoRescisao, mesesTrabalhados, salarioMensal, tipoContrato } = params;

  // Apenas dispensa sem justa causa tem direito ao seguro desemprego
  if (motivoRescisao !== 'dispensa_sem_justa_causa') {
    const motivos: Record<string, string> = {
      'dispensa_com_justa_causa': 'Dispensa por justa causa não dá direito ao seguro desemprego',
      'pedido_demissao': 'Pedido de demissão não dá direito ao seguro desemprego',
      'comum_acordo': 'Rescisão por comum acordo não dá direito ao seguro desemprego',
      'termino_contrato': 'Término de contrato por prazo determinado não dá direito (salvo exceções na Justiça)',
      'aposentadoria': 'Aposentadoria não dá direito ao seguro desemprego',
    };

    return {
      temDireito: false,
      numeroParcelas: 0,
      valorEstimadoParcela: 0,
      totalEstimado: 0,
      motivoNaoDireito: motivos[motivoRescisao || ''] || 'Este tipo de rescisão não dá direito ao seguro desemprego',
    };
  }

  // Contrato de experiência rescindido: geralmente não tem direito, mas depende
  if (tipoContrato === 'experiencia' && mesesTrabalhados < 6) {
    return {
      temDireito: false,
      numeroParcelas: 0,
      valorEstimadoParcela: 0,
      totalEstimado: 0,
      motivoNaoDireito: 'Contrato de experiência com menos de 6 meses geralmente não dá direito',
    };
  }

  // Mínimo de 3 meses trabalhados na 1ª solicitação
  if (mesesTrabalhados < 3) {
    return {
      temDireito: false,
      numeroParcelas: 0,
      valorEstimadoParcela: 0,
      totalEstimado: 0,
      motivoNaoDireito: 'São necessários no mínimo 3 meses de trabalho para ter direito ao seguro desemprego',
    };
  }

  const numeroParcelas = calcularNumeroParcelas(mesesTrabalhados);
  const valorParcela = calcularValorParcela(salarioMensal);

  return {
    temDireito: true,
    numeroParcelas,
    valorEstimadoParcela: Number(valorParcela.toFixed(2)),
    totalEstimado: Number((valorParcela * numeroParcelas).toFixed(2)),
  };
};
