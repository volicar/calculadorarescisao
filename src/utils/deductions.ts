// Tabelas INSS e IRRF 2026
// INSS: Portaria Interministerial MPS/MF nº 13/2026
// IRRF: Lei nº 15.270/2025 (isenção até R$ 5.000 + redução até R$ 7.350)

const FAIXAS_INSS = [
  { limite: 1621.0, aliquota: 0.075 },
  { limite: 2902.84, aliquota: 0.09 },
  { limite: 4354.27, aliquota: 0.12 },
  { limite: 8475.55, aliquota: 0.14 },
];

const FAIXAS_IRRF = [
  { limite: 2428.8, aliquota: 0, parcela: 0 },
  { limite: 2826.65, aliquota: 0.075, parcela: 182.16 },
  { limite: 3751.05, aliquota: 0.15, parcela: 394.16 },
  { limite: 4664.68, aliquota: 0.225, parcela: 675.49 },
  { limite: Infinity, aliquota: 0.275, parcela: 908.73 },
];

const DEDUCAO_POR_DEPENDENTE_IR = 189.59;

// Lei 15.270/2025: limites da redução do IRRF (vigente a partir de jan/2026)
const LIMITE_ISENCAO_LEI_15270 = 5000.0;
const LIMITE_REDUCAO_LEI_15270 = 7350.0;

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
  reducaoLei15270: number;
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

// Redução do IRRF da Lei 15.270/2025, calculada sobre o rendimento tributável bruto do mês
const calcularReducaoLei15270 = (rendimentoTributavel: number, impostoTabela: number): number => {
  if (rendimentoTributavel <= 0 || impostoTabela <= 0) return 0;
  if (rendimentoTributavel <= LIMITE_ISENCAO_LEI_15270) return impostoTabela; // zera o imposto
  if (rendimentoTributavel <= LIMITE_REDUCAO_LEI_15270) {
    const reducao = 978.62 - 0.133145 * rendimentoTributavel;
    return Math.min(impostoTabela, Math.max(0, reducao));
  }
  return 0;
};

export const calcularIRRF = (
  baseTributavel: number,
  numeroDependentes: number = 0,
  rendimentoTributavelBruto?: number
): ResultadoIRRF => {
  const deducaoDependentes = numeroDependentes * DEDUCAO_POR_DEPENDENTE_IR;
  const baseAposDeducoes = Math.max(0, baseTributavel - deducaoDependentes);

  const faixa = FAIXAS_IRRF.find(f => baseAposDeducoes <= f.limite) ?? FAIXAS_IRRF[FAIXAS_IRRF.length - 1];

  const impostoTabela = Math.max(0, baseAposDeducoes * faixa.aliquota - faixa.parcela);

  // Lei 15.270/2025: redução aplicada sobre o rendimento tributável do mês
  const rendimentoParaReducao = rendimentoTributavelBruto ?? baseTributavel;
  const reducaoLei15270 = calcularReducaoLei15270(rendimentoParaReducao, impostoTabela);

  const valorTotal = Math.max(0, Number((impostoTabela - reducaoLei15270).toFixed(2)));

  return {
    baseCalculo: baseTributavel,
    baseAposDeducoes: Number(baseAposDeducoes.toFixed(2)),
    aliquota: faixa.aliquota * 100,
    parcela: faixa.parcela,
    deducaoDependentes: Number(deducaoDependentes.toFixed(2)),
    reducaoLei15270: Number(reducaoLei15270.toFixed(2)),
    valorTotal,
    isento: valorTotal <= 0,
  };
};

// Calcula INSS e IRRF sobre as verbas tributáveis da rescisão
//
// Bases legais:
// - Aviso prévio indenizado: natureza indenizatória — não incide INSS (jurisprudência
//   pacífica do STJ/TST) nem IRRF (isento).
// - Férias indenizadas + 1/3: isentas de INSS (Lei 8.212/91, art. 28 §9º "d")
//   e de IRRF (Lei 7.713/88, art. 6º, V).
// - 13º salário: tributação EXCLUSIVA — INSS e IRRF calculados em separado do salário.
export const calcularDeducoesRescisao = (params: {
  saldoSalario: number;
  decimoTerceiro: number;
  numeroDependentes?: number;
}) => {
  const { saldoSalario, decimoTerceiro, numeroDependentes = 0 } = params;

  // INSS sobre o saldo de salário (verba salarial do mês)
  const inssSalario = calcularINSSProgressivo(saldoSalario);

  // INSS sobre o 13º proporcional (base exclusiva, separada do salário)
  const inss13 = calcularINSSProgressivo(decimoTerceiro);

  // IRRF sobre o saldo de salário (base = saldo - INSS)
  const baseIRRFSalario = Math.max(0, saldoSalario - inssSalario.valorTotal);
  const irrfSalario = calcularIRRF(baseIRRFSalario, numeroDependentes, saldoSalario);

  // IRRF sobre o 13º (tributação exclusiva na fonte, base = 13º - INSS do 13º)
  const baseIRRF13 = Math.max(0, decimoTerceiro - inss13.valorTotal);
  const irrf13 = calcularIRRF(baseIRRF13, numeroDependentes, decimoTerceiro);

  const totalINSS = Number((inssSalario.valorTotal + inss13.valorTotal).toFixed(2));
  const totalIRRF = Number((irrfSalario.valorTotal + irrf13.valorTotal).toFixed(2));

  return {
    inss: {
      salario: inssSalario,
      decimoTerceiro: inss13,
      valorTotal: totalINSS,
    },
    irrf: {
      salario: irrfSalario,
      decimoTerceiro: irrf13,
      valorTotal: totalIRRF,
    },
    totalDeducoes: Number((totalINSS + totalIRRF).toFixed(2)),
  };
};
