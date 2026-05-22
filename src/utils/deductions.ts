// Tabelas INSS e IRRF 2025 (referência: Portaria MPS e RFB vigentes)

const FAIXAS_INSS = [
  { limite: 1518.00, aliquota: 0.075 },
  { limite: 2793.88, aliquota: 0.09 },
  { limite: 4190.83, aliquota: 0.12 },
  { limite: 8157.41, aliquota: 0.14 },
];

const FAIXAS_IRRF = [
  { limite: 2259.20, aliquota: 0, parcela: 0 },
  { limite: 2826.65, aliquota: 0.075, parcela: 169.44 },
  { limite: 3751.05, aliquota: 0.15, parcela: 381.44 },
  { limite: 4664.68, aliquota: 0.225, parcela: 662.77 },
  { limite: Infinity, aliquota: 0.275, parcela: 896.00 },
];

const DEDUCAO_POR_DEPENDENTE_IR = 189.59;

export interface DetalheINSS {
  faixa: string;
  base: number;
  aliquota: number;
  valor: number;
}

export interface ResultadoINSS {
  baseCalculo: number;
  aliquotaEfetiva: number;
  valorTotal: number;
  detalhamento: DetalheINSS[];
}

export interface ResultadoIRRF {
  baseCalculo: number;
  baseAposDeducoes: number;
  aliquota: number;
  parcela: number;
  deducaoDependentes: number;
  valorTotal: number;
  isento: boolean;
}

export const calcularINSSProgressivo = (base: number): ResultadoINSS => {
  if (base <= 0) {
    return { baseCalculo: 0, aliquotaEfetiva: 0, valorTotal: 0, detalhamento: [] };
  }

  let totalINSS = 0;
  let limiteAnterior = 0;
  const detalhamento: DetalheINSS[] = [];

  for (const faixa of FAIXAS_INSS) {
    if (base <= limiteAnterior) break;

    const baseNaFaixa = Math.min(base, faixa.limite) - limiteAnterior;
    const valorFaixa = Number((baseNaFaixa * faixa.aliquota).toFixed(2));
    totalINSS += valorFaixa;

    if (baseNaFaixa > 0) {
      detalhamento.push({
        faixa: `até R$ ${faixa.limite.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        base: Number(baseNaFaixa.toFixed(2)),
        aliquota: faixa.aliquota * 100,
        valor: valorFaixa,
      });
    }

    limiteAnterior = faixa.limite;
    if (base <= faixa.limite) break;
  }

  return {
    baseCalculo: base,
    aliquotaEfetiva: base > 0 ? Number(((totalINSS / base) * 100).toFixed(2)) : 0,
    valorTotal: Number(totalINSS.toFixed(2)),
    detalhamento,
  };
};

export const calcularIRRF = (
  baseTributavel: number,
  numeroDependentes: number = 0
): ResultadoIRRF => {
  const deducaoDependentes = numeroDependentes * DEDUCAO_POR_DEPENDENTE_IR;
  const baseAposDeducoes = Math.max(0, baseTributavel - deducaoDependentes);

  const faixa = FAIXAS_IRRF.find(f => baseAposDeducoes <= f.limite) ?? FAIXAS_IRRF[FAIXAS_IRRF.length - 1];

  const valorBruto = baseAposDeducoes * faixa.aliquota - faixa.parcela;
  const valorTotal = Math.max(0, Number(valorBruto.toFixed(2)));

  return {
    baseCalculo: baseTributavel,
    baseAposDeducoes: Number(baseAposDeducoes.toFixed(2)),
    aliquota: faixa.aliquota * 100,
    parcela: faixa.parcela,
    deducaoDependentes: Number(deducaoDependentes.toFixed(2)),
    valorTotal,
    isento: valorTotal <= 0,
  };
};

// Calcula INSS e IRRF sobre as verbas tributáveis da rescisão
export const calcularDeducoesRescisao = (params: {
  saldoSalario: number;
  decimoTerceiro: number;
  avisoPrevioIndenizado: number;
  baseFeriasParaINSS: number; // apenas a base, sem o 1/3
  numeroDependentes?: number;
}) => {
  const { saldoSalario, decimoTerceiro, avisoPrevioIndenizado, baseFeriasParaINSS, numeroDependentes = 0 } = params;

  // Base INSS: saldo salário + 13° + aviso prévio + base férias (sem 1/3)
  const baseINSS = saldoSalario + decimoTerceiro + avisoPrevioIndenizado + baseFeriasParaINSS;
  const resultINSS = calcularINSSProgressivo(baseINSS);

  // Base IRRF: saldo + 13° + aviso prévio (férias indenizadas são isentas de IRRF - Lei 7.713/88, art. 6°, V)
  const baseTributavelIRRF = Math.max(0, saldoSalario + decimoTerceiro + avisoPrevioIndenizado - resultINSS.valorTotal);
  const resultIRRF = calcularIRRF(baseTributavelIRRF, numeroDependentes);

  return {
    inss: resultINSS,
    irrf: resultIRRF,
    totalDeducoes: Number((resultINSS.valorTotal + resultIRRF.valorTotal).toFixed(2)),
  };
};
