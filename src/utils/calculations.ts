import { CalculatorFormData, CalculationResult, getMotivoInfo } from '@/types/calculator';
import { any } from 'zod/v4';

export const validateDates = (admissao: string, demissao: string): boolean => {
  const dataAdmissao = new Date(admissao);
  const dataDemissao = new Date(demissao);
  return dataDemissao >= dataAdmissao;
};

export const calculateWorkingDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let count = 0;
  const current = new Date(start);

  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 0 = domingo, 6 = sábado
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
};

export const calculateMonthsDifference = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  let months = (end.getFullYear() - start.getFullYear()) * 12;
  months += end.getMonth() - start.getMonth();
  
  if (end.getDate() < start.getDate()) {
    months--;
  }
  
  return months;
};

export const calculateProportionalDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const monthStart = new Date(end.getFullYear(), end.getMonth(), 1);
  const daysInMonth = new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate();
  
  let workedDays;
  if (start >= monthStart) {
    // Trabalhou apenas parte do mês
    workedDays = end.getDate() - start.getDate() + 1;
  } else {
    // Trabalhou o mês todo até a data de demissão
    workedDays = end.getDate();
  }
  
  return Math.min(workedDays, daysInMonth);
};

export const calculateRescisao = (data: CalculatorFormData): CalculationResult => {
  const {
    salarioMensal,
    dataAdmissao,
    dataDemissao,
    temFGTS,
    avisoPrevio,
    tipoContrato,
    motivoRescisao,
    tempoContrato
  } = data;

  // Obter informações do motivo de rescisão
  const motivoInfo = getMotivoInfo(motivoRescisao);

  // Variáveis auxiliares
  let mesesTrabalhados = 0;
  let diasPROPorcionais = 0;

  let saldoSalario = 0;
  let feriasPROPorcionais = 0;
  let decimoTerceiroProporcional = 0;
  let fgtsMulta = 0;
  let avisoPrevioIndenizado = 0;
  let indenizacaoExperiencia = 0;
  let seguroDesemprego = false;
  let podeMovimentarFGTS = false;
  let observacoes: string[] = [];

  const salarioDiario = salarioMensal / 30;

  if (tipoContrato === 'experiencia') {
    // Cálculos para contrato de experiência
    saldoSalario = (tempoContrato * salarioDiario);

    if (motivoRescisao === 'dispensa_sem_justa_causa') {
      const diasRestantes = Math.max(0, 90 - tempoContrato);
      indenizacaoExperiencia = (diasRestantes / 2) * salarioDiario;
    }

    if (motivoInfo.direitos.ferias && tempoContrato >= 15) {
      feriasPROPorcionais = (tempoContrato / 365) * (salarioMensal + salarioMensal / 3);
    }

    if (motivoInfo.direitos.decimoTerceiro) {
      decimoTerceiroProporcional = (tempoContrato / 365) * salarioMensal;
    }

  } else {
    // Cálculos para contrato normal
    mesesTrabalhados = calculateMonthsDifference(dataAdmissao, dataDemissao);
    diasPROPorcionais = calculateProportionalDays(dataAdmissao, dataDemissao);

    if (motivoInfo.direitos.saldoSalario) {
      saldoSalario = (diasPROPorcionais * salarioDiario);
    }

    if (motivoInfo.direitos.ferias) {
      const mesesParaFerias = mesesTrabalhados + (diasPROPorcionais > 14 ? 1 : 0);
      if (mesesParaFerias > 0) {
        feriasPROPorcionais = (mesesParaFerias / 12) * (salarioMensal + salarioMensal / 3);
      }
    } else if (motivoRescisao === 'dispensa_com_justa_causa') {
      if (mesesTrabalhados >= 12) {
        const periodosCompletos = Math.floor(mesesTrabalhados / 12);
        feriasPROPorcionais = periodosCompletos * (salarioMensal + salarioMensal / 3);
      }
    }

    if (motivoInfo.direitos.decimoTerceiro) {
      const mesesPara13 = mesesTrabalhados + (diasPROPorcionais > 14 ? 1 : 0);
      decimoTerceiroProporcional = (mesesPara13 / 12) * salarioMensal;
    }

    if (motivoInfo.direitos.avisoPrevio && avisoPrevio === 'indenizado') {
      let valorAvisoPrevio = salarioMensal;

      if (motivoRescisao === 'comum_acordo') {
        valorAvisoPrevio = salarioMensal / 2;
      }

      avisoPrevioIndenizado = valorAvisoPrevio;
    }
  }

  // FGTS e Multa
  if (temFGTS) {
    let saldoFGTS = 0;

    if (tipoContrato === 'experiencia') {
      saldoFGTS = (tempoContrato / 30) * (salarioMensal * 0.08);
    } else {
      saldoFGTS = mesesTrabalhados * (salarioMensal * 0.08);
    }

    if (motivoInfo.direitos.multaFgts && motivoInfo.multaFgtsPercentual) {
      fgtsMulta = saldoFGTS * (motivoInfo.multaFgtsPercentual / 100);
    }

    podeMovimentarFGTS = motivoInfo.direitos.fgts;

    if (podeMovimentarFGTS && motivoInfo.fgtsAcessivel) {
      observacoes.push(`Pode sacar ${motivoInfo.fgtsAcessivel}% do FGTS`);
    }
  }

  // Seguro-desemprego
  seguroDesemprego = motivoInfo.direitos.seguroDesemprego;

  // Observações adicionais
  observacoes = [...observacoes, ...motivoInfo.observacoes];

  // Total
  const total = saldoSalario + feriasPROPorcionais + decimoTerceiroProporcional +
                fgtsMulta + avisoPrevioIndenizado + indenizacaoExperiencia;

  return {
    saldoSalario: Math.max(0, saldoSalario),
    feriasPROPorcionais: Math.max(0, feriasPROPorcionais),
    decimoTerceiroProporcional: Math.max(0, decimoTerceiroProporcional),
    fgtsMulta: Math.max(0, fgtsMulta),
    avisoPrevioIndenizado: Math.max(0, avisoPrevioIndenizado),
    indenizacaoExperiencia: Math.max(0, indenizacaoExperiencia),
    total: Math.max(0, total),
    seguroDesemprego,
    podeMovimentarFGTS,
    observacoes
  };
};