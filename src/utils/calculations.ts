import { CalculatorFormData, CalculationResult } from '@/types/calculator';
import { calcularDeducoesRescisao } from '@/utils/deductions';
import { calcularSeguroDesemprego } from '@/utils/seguroDesemprego';

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
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
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
    workedDays = end.getDate() - start.getDate() + 1;
  } else {
    workedDays = end.getDate();
  }

  return Math.min(workedDays, daysInMonth);
};

const getMotivoRescisaoInfo = (motivo: string) => {
  const info = {
    temDireitoAvisoPrevio: false,
    temDireitoMultaFGTS: false,
    percentualMultaFGTS: 0,
    temDireitoFerias: true,
    temDireito13: true,
    temDireitoSeguroDesemprego: false,
    podeMovimentarFGTS: false,
  };

  switch (motivo) {
    case 'dispensa_sem_justa_causa':
      info.temDireitoAvisoPrevio = true;
      info.temDireitoMultaFGTS = true;
      info.percentualMultaFGTS = 40;
      info.temDireitoSeguroDesemprego = true;
      info.podeMovimentarFGTS = true;
      break;

    case 'dispensa_com_justa_causa':
      info.temDireitoAvisoPrevio = false;
      info.temDireitoMultaFGTS = false;
      info.temDireitoFerias = false;
      info.temDireito13 = false;
      info.temDireitoSeguroDesemprego = false;
      info.podeMovimentarFGTS = false;
      break;

    case 'pedido_demissao':
      info.temDireitoAvisoPrevio = false;
      info.temDireitoMultaFGTS = false;
      info.temDireitoSeguroDesemprego = false;
      info.podeMovimentarFGTS = false;
      break;

    case 'comum_acordo':
      info.temDireitoAvisoPrevio = true;
      info.temDireitoMultaFGTS = true;
      info.percentualMultaFGTS = 20;
      info.temDireitoSeguroDesemprego = false;
      info.podeMovimentarFGTS = true;
      break;

    case 'termino_contrato':
    case 'aposentadoria':
      info.temDireitoAvisoPrevio = false;
      info.temDireitoMultaFGTS = false;
      info.temDireitoSeguroDesemprego = false;
      info.podeMovimentarFGTS = true;
      break;

    default:
      info.temDireitoAvisoPrevio = true;
      info.temDireitoMultaFGTS = true;
      info.percentualMultaFGTS = 40;
      info.temDireitoSeguroDesemprego = true;
      info.podeMovimentarFGTS = true;
      break;
  }

  return info;
};

const calculateYearsWorked = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  let years = end.getFullYear() - start.getFullYear();
  if (
    end.getMonth() < start.getMonth() ||
    (end.getMonth() === start.getMonth() && end.getDate() < start.getDate())
  ) {
    years--;
  }

  return Math.max(0, years);
};

// Calcula prazo limite de pagamento (10 dias corridos após a demissão - Art. 477 §6° CLT)
const calcularPrazoPagamento = (dataDemissao: string, avisoPrevio?: string): { prazo: string; dias: number } => {
  const demissao = new Date(dataDemissao);
  // Com aviso prévio indenizado: 10 dias após a data do aviso
  // Com aviso prévio trabalhado: 1° dia útil após o término
  // Sem aviso prévio: 10 dias corridos
  const prazoData = new Date(demissao);
  prazoData.setDate(prazoData.getDate() + 10);

  const hoje = new Date();
  const diffMs = prazoData.getTime() - hoje.getTime();
  const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return {
    prazo: prazoData.toISOString().split('T')[0],
    dias: diffDias,
  };
};

export const calcularAlertaEstabilidade = (
  temEstabilidade?: boolean,
  tipoEstabilidade?: string,
  motivoRescisao?: string
): string | undefined => {
  if (!temEstabilidade) return undefined;
  if (motivoRescisao === 'pedido_demissao') return undefined;

  const alertas: Record<string, string> = {
    gestante: 'ATENÇÃO: Gestantes têm estabilidade provisória desde a confirmação da gravidez até 5 meses após o parto (Súmula 244 TST). A demissão pode ser considerada nula e gerar direito à reintegração ou indenização do período de estabilidade.',
    acidente: 'ATENÇÃO: Empregados afastados por acidente de trabalho têm estabilidade de 12 meses após o retorno (Art. 118 Lei 8.213/91). A demissão pode gerar indenização substitutiva.',
    cipa: 'ATENÇÃO: Cipeiros eleitos têm estabilidade durante o mandato + 12 meses após o término (Art. 165 CLT). Consulte um advogado trabalhista.',
    sindical: 'ATENÇÃO: Dirigentes sindicais têm estabilidade durante o mandato + 1 ano após (Art. 543 §3° CLT). A dispensa pode ser nula.',
    outro: 'ATENÇÃO: Você indicou possuir estabilidade provisória. Consulte um advogado trabalhista antes de aceitar qualquer acordo ou assinar documentos de rescisão.',
  };

  return alertas[tipoEstabilidade || 'outro'];
};

export const calculateRescisao = (data: CalculatorFormData): CalculationResult => {
  const {
    salarioMensal,
    comissoes = 0,
    adicionaisHabituais = 0,
    dataAdmissao,
    dataDemissao,
    temFGTS,
    avisoPrevio,
    tipoContrato,
    motivoRescisao,
    tempoContrato,
    temEstabilidade,
    tipoEstabilidade,
    numeroDependentesIR = 0,
  } = data;

  // Salário base para cálculos (inclui comissões e adicionais habituais)
  const salarioBase = salarioMensal + comissoes + adicionaisHabituais;

  const motivoFinal = motivoRescisao || 'dispensa_sem_justa_causa';
  const direitos = getMotivoRescisaoInfo(motivoFinal);

  let saldoSalario = 0;
  let feriasPROPorcionais = 0;
  let decimoTerceiroProporcional = 0;
  let saldoFGTS = 0;
  let multaFGTS = 0;
  let fgtsMulta = 0;
  let avisoPrevioIndenizado = 0;
  let indenizacaoExperiencia = 0;
  let baseFeriasParaINSS = 0;

  const salarioDiario = salarioBase / 30;

  if (tipoContrato === 'experiencia') {
    const diasTrabalhados = tempoContrato || 0;

    saldoSalario = diasTrabalhados * salarioDiario;

    if (motivoFinal === 'dispensa_sem_justa_causa' && diasTrabalhados < 90) {
      const diasRestantes = 90 - diasTrabalhados;
      indenizacaoExperiencia = (diasRestantes / 2) * salarioDiario;
    }

    if (direitos.temDireitoFerias && diasTrabalhados > 15) {
      const baseFerias = (diasTrabalhados / 360) * salarioBase;
      const umTerco = baseFerias / 3;
      feriasPROPorcionais = baseFerias + umTerco;
      baseFeriasParaINSS = baseFerias;
    }

    if (direitos.temDireito13 && diasTrabalhados >= 15) {
      decimoTerceiroProporcional = (diasTrabalhados / 360) * salarioBase;
    }

    if (temFGTS) {
      // FGTS base: 8% sobre salário × meses + sobre 13° proporcional
      const mesesFGTS = diasTrabalhados / 30;
      saldoFGTS = mesesFGTS * (salarioBase * 0.08);
      // FGTS sobre 13° proporcional
      saldoFGTS += decimoTerceiroProporcional * 0.08;
      saldoFGTS = Number(saldoFGTS.toFixed(2));

      if (direitos.temDireitoMultaFGTS && direitos.percentualMultaFGTS > 0) {
        multaFGTS = Number((saldoFGTS * (direitos.percentualMultaFGTS / 100)).toFixed(2));
      }
      fgtsMulta = saldoFGTS + multaFGTS;
    }
  } else {
    const mesesTrabalhados = calculateMonthsDifference(dataAdmissao, dataDemissao);
    const diasProporcionais = calculateProportionalDays(dataAdmissao, dataDemissao);
    const anosTrabalhados = calculateYearsWorked(dataAdmissao, dataDemissao);

    saldoSalario = diasProporcionais * salarioDiario;

    if (direitos.temDireitoFerias) {
      const mesesParaFerias = mesesTrabalhados + (diasProporcionais > 14 ? 1 : 0);
      if (mesesParaFerias > 0) {
        const baseFerias = (mesesParaFerias / 12) * salarioBase;
        const umTerco = baseFerias / 3;
        feriasPROPorcionais = baseFerias + umTerco;
        baseFeriasParaINSS = baseFerias;
      }
    } else if (motivoFinal === 'dispensa_com_justa_causa') {
      const periodosCompletos = Math.floor(mesesTrabalhados / 12);
      if (periodosCompletos > 0) {
        const feriasVencidas = periodosCompletos * salarioBase;
        const umTercoVencidas = feriasVencidas / 3;
        feriasPROPorcionais = feriasVencidas + umTercoVencidas;
        baseFeriasParaINSS = feriasVencidas;
      }
    }

    if (direitos.temDireito13) {
      const mesesPara13 = mesesTrabalhados + (diasProporcionais > 14 ? 1 : 0);
      if (mesesPara13 > 0) {
        decimoTerceiroProporcional = (mesesPara13 / 12) * salarioBase;
      }
    }

    if (direitos.temDireitoAvisoPrevio && avisoPrevio === 'indenizado') {
      const diasAvisoPrevio = Math.min(30 + anosTrabalhados * 3, 90);
      let valorAvisoPrevio = (diasAvisoPrevio / 30) * salarioBase;

      if (motivoFinal === 'comum_acordo') {
        valorAvisoPrevio = valorAvisoPrevio / 2;
      }

      avisoPrevioIndenizado = valorAvisoPrevio;
    }

    if (temFGTS) {
      const mesesCompletos = mesesTrabalhados;
      const fracaoMes = diasProporcionais > 14 ? 1 : diasProporcionais / 30;
      const totalMesesFGTS = mesesCompletos + fracaoMes;

      // FGTS base: 8% sobre salário mensal × meses
      saldoFGTS = totalMesesFGTS * (salarioBase * 0.08);
      // FGTS sobre 13° proporcional
      saldoFGTS += decimoTerceiroProporcional * 0.08;
      // FGTS sobre aviso prévio indenizado
      if (avisoPrevioIndenizado > 0) {
        saldoFGTS += avisoPrevioIndenizado * 0.08;
      }
      saldoFGTS = Number(saldoFGTS.toFixed(2));

      if (direitos.temDireitoMultaFGTS && direitos.percentualMultaFGTS > 0) {
        multaFGTS = Number((saldoFGTS * (direitos.percentualMultaFGTS / 100)).toFixed(2));
      }
      fgtsMulta = Number((saldoFGTS + multaFGTS).toFixed(2));
    }
  }

  const total = Number(
    (saldoSalario + feriasPROPorcionais + decimoTerceiroProporcional + fgtsMulta + avisoPrevioIndenizado + indenizacaoExperiencia).toFixed(2)
  );

  // Deduções (INSS + IRRF sobre as verbas tributáveis)
  const deducoes = calcularDeducoesRescisao({
    saldoSalario: Math.max(0, saldoSalario),
    decimoTerceiro: Math.max(0, decimoTerceiroProporcional),
    avisoPrevioIndenizado: Math.max(0, avisoPrevioIndenizado),
    baseFeriasParaINSS: Math.max(0, baseFeriasParaINSS),
    numeroDependentes: numeroDependentesIR,
  });

  const totalLiquido = Number(Math.max(0, total - deducoes.totalDeducoes).toFixed(2));

  // Prazo de pagamento
  const { prazo: prazoLimitePagamento, dias: diasParaPagamento } = calcularPrazoPagamento(dataDemissao, avisoPrevio);

  // Seguro desemprego
  const mesesParaSeguro = tipoContrato === 'experiencia'
    ? Math.floor((tempoContrato || 0) / 30)
    : calculateMonthsDifference(dataAdmissao, dataDemissao);

  const seguroDesemprego = calcularSeguroDesemprego({
    motivoRescisao: motivoFinal,
    mesesTrabalhados: mesesParaSeguro,
    salarioMensal: salarioBase,
    tipoContrato,
  });

  // Alerta estabilidade
  const alertaEstabilidade = calcularAlertaEstabilidade(temEstabilidade, tipoEstabilidade, motivoFinal);

  return {
    saldoSalario: Math.max(0, Number(saldoSalario.toFixed(2))),
    feriasPROPorcionais: Math.max(0, Number(feriasPROPorcionais.toFixed(2))),
    decimoTerceiroProporcional: Math.max(0, Number(decimoTerceiroProporcional.toFixed(2))),
    fgtsMulta: Math.max(0, Number(fgtsMulta.toFixed(2))),
    avisoPrevioIndenizado: Math.max(0, Number(avisoPrevioIndenizado.toFixed(2))),
    indenizacaoExperiencia: Math.max(0, Number(indenizacaoExperiencia.toFixed(2))),
    total: Math.max(0, total),
    saldoFGTS: Math.max(0, saldoFGTS),
    multaFGTS: Math.max(0, multaFGTS),
    deducaoINSS: deducoes.inss.valorTotal,
    deducaoIRRF: deducoes.irrf.valorTotal,
    totalLiquido,
    prazoLimitePagamento,
    diasParaPagamento,
    seguroDesemprego,
    alertaEstabilidade,
  };
};

export function calculateFerias(
  mesesTrabalhados: number,
  diasProporcionais: number,
  salarioMensal: number,
  motivoRescisao: string
): number {
  let totalFerias = 0;

  const periodosCompletos = Math.floor(mesesTrabalhados / 12);
  if (periodosCompletos > 0) {
    const feriasVencidas = periodosCompletos * salarioMensal;
    const umTercoVencidas = feriasVencidas / 3;
    totalFerias += feriasVencidas + umTercoVencidas;
  }

  if (motivoRescisao !== 'dispensa_com_justa_causa') {
    const mesesProporcional = mesesTrabalhados % 12;
    const mesesParaCalculo = mesesProporcional + (diasProporcionais > 14 ? 1 : 0);

    if (mesesParaCalculo > 0) {
      const feriasProporcionais = (mesesParaCalculo / 12) * salarioMensal;
      const umTercoProporcionais = feriasProporcionais / 3;
      totalFerias += feriasProporcionais + umTercoProporcionais;
    }
  }

  return Number(totalFerias.toFixed(2));
}
