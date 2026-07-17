// Seguro Desemprego - Lei 7.998/90 atualizada
// Valores de referência 2026 (reajuste MTE vigente desde 11/01/2026, INPC 3,90%)

import { SeguroDesempregoResult } from '@/types/calculator';

const SALARIO_MINIMO_2026 = 1621.0;

// Faixas para cálculo do valor da parcela (2026)
const FAIXAS_SEGURO = [
  { limite: 2222.17, multiplicador: 0.8 },
  { limite: 3703.99, multiplicador: 0.5 },
];

const VALOR_MAXIMO_PARCELA = 2518.65;

const calcularValorParcela = (mediaUltimosSalarios: number): number => {
  let valor = 0;

  if (mediaUltimosSalarios <= FAIXAS_SEGURO[0].limite) {
    valor = mediaUltimosSalarios * FAIXAS_SEGURO[0].multiplicador;
  } else if (mediaUltimosSalarios <= FAIXAS_SEGURO[1].limite) {
    valor =
      FAIXAS_SEGURO[0].limite * FAIXAS_SEGURO[0].multiplicador +
      (mediaUltimosSalarios - FAIXAS_SEGURO[0].limite) * FAIXAS_SEGURO[1].multiplicador;
  } else {
    valor = VALOR_MAXIMO_PARCELA;
  }

  // Mínimo: salário mínimo / Máximo: teto 2026
  return Math.min(Math.max(valor, SALARIO_MINIMO_2026), VALOR_MAXIMO_PARCELA);
};

// Nº de parcelas na 1ª solicitação (Lei 7.998/90, art. 4º):
// 12 a 23 meses trabalhados nos últimos 36 meses = 4 parcelas; 24+ = 5 parcelas.
// Mínimo de 12 meses nos últimos 18 para ter direito.
const calcularNumeroParcelas = (mesesTrabalhados: number): number => {
  if (mesesTrabalhados >= 24) return 5;
  return 4;
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

  // Contrato de experiência: máximo 90 dias, nunca atinge os 12 meses exigidos
  if (tipoContrato === 'experiencia') {
    return {
      temDireito: false,
      numeroParcelas: 0,
      valorEstimadoParcela: 0,
      totalEstimado: 0,
      motivoNaoDireito: 'Contrato de experiência não atinge os 12 meses mínimos exigidos na 1ª solicitação',
    };
  }

  // 1ª solicitação: mínimo de 12 meses trabalhados nos últimos 18 (Lei 7.998/90, art. 3º, I)
  if (mesesTrabalhados < 12) {
    return {
      temDireito: false,
      numeroParcelas: 0,
      valorEstimadoParcela: 0,
      totalEstimado: 0,
      motivoNaoDireito: 'Na 1ª solicitação são necessários no mínimo 12 meses de trabalho nos últimos 18 meses (na 2ª solicitação o mínimo cai para 9 meses e da 3ª em diante, 6 meses)',
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
