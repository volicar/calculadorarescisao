import { CalculatorFormData, CalculationResult } from '@/types/calculator';
import { calcularDeducoesRescisao } from '@/utils/deductions';
import { calcularSeguroDesemprego } from '@/utils/seguroDesemprego';

// Interpreta 'YYYY-MM-DD' como data LOCAL — new Date(string) parseia em UTC e
// desloca um dia para trás em fusos negativos como o do Brasil
const parseDate = (iso: string): Date => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const toISODate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const validateDates = (admissao: string, demissao: string): boolean => {
  const dataAdmissao = parseDate(admissao);
  const dataDemissao = parseDate(demissao);
  return dataDemissao >= dataAdmissao;
};

export const calculateMonthsDifference = (startDate: string, endDate: string): number => {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  let months = (end.getFullYear() - start.getFullYear()) * 12;
  months += end.getMonth() - start.getMonth();

  if (end.getDate() < start.getDate()) {
    months--;
  }

  return months;
};

export const calculateProportionalDays = (startDate: string, endDate: string): number => {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

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

// Meses para o 13º proporcional: meses trabalhados NO ANO da rescisão,
// contando o mês em que houve 15 dias ou mais de trabalho (Lei 4.090/62)
export const calcularMeses13 = (dataAdmissao: string, dataFim: string): number => {
  const admissao = parseDate(dataAdmissao);
  const fim = parseDate(dataFim);

  const inicioAno = new Date(fim.getFullYear(), 0, 1);
  const inicio = admissao > inicioAno ? admissao : inicioAno;
  if (inicio > fim) return 0;

  let meses = 0;
  for (let m = inicio.getMonth(); m <= fim.getMonth(); m++) {
    const primeiroDia = m === inicio.getMonth() ? inicio.getDate() : 1;
    const ultimoDiaMes = new Date(fim.getFullYear(), m + 1, 0).getDate();
    const ultimoDia = m === fim.getMonth() ? fim.getDate() : ultimoDiaMes;
    if (ultimoDia - primeiroDia + 1 >= 15) {
      meses++;
    }
  }

  return Math.min(meses, 12);
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
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  let years = end.getFullYear() - start.getFullYear();
  if (
    end.getMonth() < start.getMonth() ||
    (end.getMonth() === start.getMonth() && end.getDate() < start.getDate())
  ) {
    years--;
  }

  return Math.max(0, years);
};

// Projeta a data de término do contrato somando os dias do aviso prévio indenizado
// (Lei 12.506/2011 + OJ 82 SDI-1 TST: o período do aviso indenizado integra o
// tempo de serviço para férias, 13º e demais direitos)
const projetarDataTermino = (dataDemissao: string, diasAviso: number): string => {
  const data = parseDate(dataDemissao);
  data.setDate(data.getDate() + diasAviso);
  return toISODate(data);
};

// Calcula prazo limite de pagamento (10 dias corridos após o término do contrato - Art. 477 §6° CLT)
const calcularPrazoPagamento = (dataDemissao: string): { prazo: string; dias: number } => {
  const demissao = parseDate(dataDemissao);
  const prazoData = new Date(demissao);
  prazoData.setDate(prazoData.getDate() + 10);

  const hoje = new Date();
  const diffMs = prazoData.getTime() - hoje.getTime();
  const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return {
    prazo: toISODate(prazoData),
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
    mediaHorasExtras = 0,
    temFeriasVencidas = false,
    saldoFGTSReal = 0,
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

  // Blindagem: NaN em qualquer campo numérico contaminaria todo o cálculo
  const dependentesIR = Number.isFinite(numeroDependentesIR) ? Math.max(0, numeroDependentesIR) : 0;

  // Salário base para cálculos (inclui comissões, adicionais habituais e média de horas extras)
  const salarioBase = salarioMensal + comissoes + adicionaisHabituais + mediaHorasExtras;

  const motivoFinal = motivoRescisao || 'dispensa_sem_justa_causa';
  const direitos = getMotivoRescisaoInfo(motivoFinal);

  let saldoSalario = 0;
  let feriasVencidas = 0;
  let feriasPROPorcionais = 0;
  let decimoTerceiroProporcional = 0;
  let saldoFGTS = 0;
  let multaFGTS = 0;
  let fgtsMulta = 0;
  let avisoPrevioIndenizado = 0;
  let indenizacaoExperiencia = 0;
  let diasAvisoPrevio = 0;
  let dataTerminoProjetada: string | undefined;

  const salarioDiario = salarioBase / 30;

  // Férias vencidas: período aquisitivo completo não gozado — devidas em QUALQUER
  // modalidade de rescisão, inclusive justa causa (Súmula 171 TST a contrario sensu)
  if (temFeriasVencidas && tipoContrato === 'normal') {
    feriasVencidas = salarioBase + salarioBase / 3;
  }

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

      // Se o usuário informou o saldo real da conta do FGTS, a multa incide sobre ele
      const baseMulta = saldoFGTSReal > 0 ? saldoFGTSReal : saldoFGTS;

      if (direitos.temDireitoMultaFGTS && direitos.percentualMultaFGTS > 0) {
        multaFGTS = Number((baseMulta * (direitos.percentualMultaFGTS / 100)).toFixed(2));
      }
      fgtsMulta = Number((saldoFGTS + multaFGTS).toFixed(2));
    }
  } else {
    // Aviso prévio indenizado: calcula dias e projeta a data de término
    // (Lei 12.506/2011: 30 dias + 3 por ano completo, máx. 90)
    const anosParaAviso = calculateYearsWorked(dataAdmissao, dataDemissao);

    if (direitos.temDireitoAvisoPrevio && avisoPrevio === 'indenizado') {
      diasAvisoPrevio = Math.min(30 + anosParaAviso * 3, 90);
      let valorAvisoPrevio = (diasAvisoPrevio / 30) * salarioBase;

      if (motivoFinal === 'comum_acordo') {
        valorAvisoPrevio = valorAvisoPrevio / 2;
      }

      avisoPrevioIndenizado = valorAvisoPrevio;
      dataTerminoProjetada = projetarDataTermino(dataDemissao, diasAvisoPrevio);
    }

    // OJ 82 SDI-1 TST: o aviso indenizado projeta o contrato para frente —
    // férias e 13º são contados até a data projetada
    const dataFimContrato = dataTerminoProjetada || dataDemissao;

    const mesesTrabalhados = calculateMonthsDifference(dataAdmissao, dataFimContrato);
    const diasProporcionais = calculateProportionalDays(dataAdmissao, dataFimContrato);

    // Saldo de salário: dias efetivamente trabalhados no mês da demissão (sem projeção)
    saldoSalario = calculateProportionalDays(dataAdmissao, dataDemissao) * salarioDiario;

    if (direitos.temDireitoFerias) {
      // Férias proporcionais: apenas os meses do período aquisitivo EM CURSO (meses % 12).
      // Períodos completos anteriores entram como férias vencidas somente se não gozadas
      // (checkbox "férias vencidas").
      const mesesPeriodoAtual = mesesTrabalhados % 12;
      const mesesParaFerias = Math.min(12, mesesPeriodoAtual + (diasProporcionais > 14 ? 1 : 0));
      if (mesesParaFerias > 0) {
        const baseFerias = (mesesParaFerias / 12) * salarioBase;
        const umTerco = baseFerias / 3;
        feriasPROPorcionais = baseFerias + umTerco;
      }
    }

    if (direitos.temDireito13) {
      // 13º proporcional: meses trabalhados no ANO da rescisão (com projeção do aviso)
      const meses13 = calcularMeses13(dataAdmissao, dataFimContrato);
      if (meses13 > 0) {
        decimoTerceiroProporcional = (meses13 / 12) * salarioBase;
      }
    }

    if (temFGTS) {
      const mesesReais = calculateMonthsDifference(dataAdmissao, dataDemissao);
      const diasReais = calculateProportionalDays(dataAdmissao, dataDemissao);
      const fracaoMes = diasReais > 14 ? 1 : diasReais / 30;
      const totalMesesFGTS = mesesReais + fracaoMes;

      // FGTS base: 8% sobre salário mensal × meses (estimativa de depósitos)
      saldoFGTS = totalMesesFGTS * (salarioBase * 0.08);
      // FGTS sobre 13° proporcional
      saldoFGTS += decimoTerceiroProporcional * 0.08;
      // FGTS sobre aviso prévio indenizado
      if (avisoPrevioIndenizado > 0) {
        saldoFGTS += avisoPrevioIndenizado * 0.08;
      }
      saldoFGTS = Number(saldoFGTS.toFixed(2));

      // Se o usuário informou o saldo real da conta do FGTS, usa como base da multa
      // (a multa de 40%/20% incide sobre o saldo efetivo, não sobre a estimativa)
      const baseMulta = saldoFGTSReal > 0 ? saldoFGTSReal : saldoFGTS;
      const saldoExibido = saldoFGTSReal > 0 ? saldoFGTSReal : saldoFGTS;

      if (direitos.temDireitoMultaFGTS && direitos.percentualMultaFGTS > 0) {
        multaFGTS = Number((baseMulta * (direitos.percentualMultaFGTS / 100)).toFixed(2));
      }
      saldoFGTS = saldoExibido;
      fgtsMulta = Number((saldoExibido + multaFGTS).toFixed(2));
    }
  }

  const total = Number(
    (
      saldoSalario +
      feriasVencidas +
      feriasPROPorcionais +
      decimoTerceiroProporcional +
      fgtsMulta +
      avisoPrevioIndenizado +
      indenizacaoExperiencia
    ).toFixed(2)
  );

  // Deduções: INSS + IRRF apenas sobre verbas tributáveis (saldo de salário e 13º).
  // Aviso indenizado e férias indenizadas (+1/3) são isentos.
  const deducoes = calcularDeducoesRescisao({
    saldoSalario: Math.max(0, saldoSalario),
    decimoTerceiro: Math.max(0, decimoTerceiroProporcional),
    numeroDependentes: dependentesIR,
  });

  const totalLiquido = Number(Math.max(0, total - deducoes.totalDeducoes).toFixed(2));

  // Prazo de pagamento: 10 dias corridos a partir do término do contrato (Art. 477 §6º CLT)
  const { prazo: prazoLimitePagamento, dias: diasParaPagamento } = calcularPrazoPagamento(dataDemissao);

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
    feriasVencidas: Math.max(0, Number(feriasVencidas.toFixed(2))),
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
    diasAvisoPrevio,
    dataTerminoProjetada,
    seguroDesemprego,
    alertaEstabilidade,
  };
};
