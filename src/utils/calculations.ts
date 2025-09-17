import { CalculatorFormData, CalculationResult } from '@/types/calculator';

export const calculateRescisao = (data: CalculatorFormData): CalculationResult => {
  const salarioMensal = data.salarioMensal;
  const salarioDiario = salarioMensal / 30;

  const dataDemissao = new Date(data.dataDemissao);
  const dataAdmissao = new Date(data.dataAdmissao);

  // Dias trabalhados no mês da demissão (saldo de salário)
  const diasTrabalhados = dataDemissao.getDate();
  const saldoSalario = salarioDiario * diasTrabalhados;

  // Meses trabalhados (cálculo correto pela CLT)
  let mesesTrabalhados =
    (dataDemissao.getFullYear() - dataAdmissao.getFullYear()) * 12 +
    (dataDemissao.getMonth() - dataAdmissao.getMonth());

  // Regra dos 15 dias (se trabalhou 15 ou mais no mês da demissão, conta mais 1 mês)
  if (diasTrabalhados >= 15) {
    mesesTrabalhados += 1;
  }

  const isContratoExperiencia = data.tipoContrato === 'experiencia';

  // Férias proporcionais + 1/3
  const feriasBase = (salarioMensal / 12) * mesesTrabalhados;
  const feriasPROPorcionais =
    isContratoExperiencia && data.motivoRescisao !== 'empresa'
      ? 0
      : feriasBase + feriasBase / 3;

  // 13º proporcional
  const decimoTerceiroProporcional =
    isContratoExperiencia && data.motivoRescisao !== 'empresa'
      ? 0
      : (salarioMensal / 12) * mesesTrabalhados;

  // FGTS (8% + multa 40% se dispensa sem justa causa)
  const fgtsBase = data.temFGTS ? salarioMensal * mesesTrabalhados * 0.08 : 0;
  const fgtsMulta =
    data.temFGTS && data.motivoRescisao === 'empresa'
      ? fgtsBase * 0.4
      : 0;

  // Aviso prévio
  const avisoPrevioIndenizado =
    isContratoExperiencia
      ? 0
      : data.avisoPrevio === 'indenizado'
      ? salarioMensal
      : 0;

  // Indenização contrato experiência
  const indenizacaoExperiencia = isContratoExperiencia
    ? calcularIndenizacaoExperiencia(
        data.motivoRescisao,
        salarioMensal,
        data.tempoContrato
      )
    : 0;

  const total =
    saldoSalario +
    feriasPROPorcionais +
    decimoTerceiroProporcional +
    fgtsMulta +
    avisoPrevioIndenizado +
    indenizacaoExperiencia;

  return {
    saldoSalario,
    feriasPROPorcionais,
    decimoTerceiroProporcional,
    fgtsMulta,
    avisoPrevioIndenizado,
    indenizacaoExperiencia,
    total,
  };
};

const calcularIndenizacaoExperiencia = (
  motivoRescisao: string,
  salarioMensal: number,
  tempoContrato: number
): number => {
  if (motivoRescisao === 'empresa') {
    return salarioMensal * ((90 - tempoContrato) / 30);
  } else if (motivoRescisao === 'funcionario') {
    return (salarioMensal * ((90 - tempoContrato) / 30)) / 2;
  }
  return 0;
};

export const validateDates = (
  dataAdmissao: string,
  dataDemissao: string
): boolean => {
  const admissao = new Date(dataAdmissao);
  const demissao = new Date(dataDemissao);
  const hoje = new Date();

  return admissao < demissao && demissao <= hoje;
};
