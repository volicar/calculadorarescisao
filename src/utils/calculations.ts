import { CalculatorFormData, CalculationResult, getMotivoInfo } from '@/types/calculator';

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

  // Definir motivo padrão para experiência (já que não há campo no form)
  const motivoFinal = tipoContrato === 'experiencia' ? 'dispensa_sem_justa_causa' : motivoRescisao;
  
  // Obter informações do motivo de rescisão com fallback de segurança
  const motivoInfo = getMotivoInfo(motivoFinal) || {
    direitos: {
      saldoSalario: true,
      ferias: true,
      decimoTerceiro: true,
      avisoPrevio: false,
      multaFgts: false,
      fgts: false,
      seguroDesemprego: false
    },
    multaFgtsPercentual: 0,
    fgtsAcessivel: 0,
    observacoes: []
  };

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

    // CORREÇÃO: Indenização experiência Art. 479 CLT - apenas para rescisão antecipada pelo empregador
    if (motivoFinal === 'dispensa_sem_justa_causa' && tempoContrato < 90) {
      const diasRestantes = Math.max(0, 90 - tempoContrato);
      // Art. 479 CLT: indenização = 50% da remuneração dos dias restantes
      indenizacaoExperiencia = (diasRestantes / 2) * salarioDiario;
    }

    // CORREÇÃO: Férias proporcionais para contrato experiência
    // CLT: Direito se trabalhou mais de 15 dias E não foi demitido por justa causa
    if (tempoContrato > 15 && motivoFinal !== 'dispensa_com_justa_causa') {
      // Base: meses trabalhados (considerando fração > 15 dias = mês completo)
      const mesesTrabalhados = tempoContrato > 15 ? Math.ceil(tempoContrato / 30) : 0;
      const valorFerias = (mesesTrabalhados / 12) * salarioMensal;
      const umTerco = valorFerias / 3;
      feriasPROPorcionais = valorFerias + umTerco;
    }

    // CORREÇÃO: 13º proporcional para experiência (Art. 24 Decreto-Lei 1.535/77)
    if (motivoInfo?.direitos?.decimoTerceiro && tempoContrato >= 15) {
      // Base: 1/12 por mês trabalhado (fração > 15 dias = mês completo)
      const mesesPara13 = tempoContrato > 15 ? Math.ceil(tempoContrato / 30) : 0;
      decimoTerceiroProporcional = (mesesPara13 / 12) * salarioMensal;
    }

  } else {
    // Cálculos para contrato normal
    mesesTrabalhados = calculateMonthsDifference(dataAdmissao, dataDemissao);
    diasPROPorcionais = calculateProportionalDays(dataAdmissao, dataDemissao);

    // CORREÇÃO: Saldo de salário sempre pago (independente do motivo)
    saldoSalario = (diasPROPorcionais * salarioDiario);

    // Cálculo de férias conforme CLT
    feriasPROPorcionais = calculateFerias(
      mesesTrabalhados, 
      diasPROPorcionais, 
      salarioMensal, 
      motivoFinal
    );

    // CORREÇÃO: 13º proporcional sempre pago (exceto em casos específicos)
    if (motivoFinal !== 'dispensa_com_justa_causa' || mesesTrabalhados >= 1) {
      const mesesPara13 = mesesTrabalhados + (diasPROPorcionais > 14 ? 1 : 0);
      decimoTerceiroProporcional = (mesesPara13 / 12) * salarioMensal;
    }

    // Aviso prévio - com validação de segurança
    if (motivoInfo?.direitos?.avisoPrevio && avisoPrevio === 'indenizado') {
      let valorAvisoPrevio = salarioMensal;

      if (motivoFinal === 'comum_acordo') {
        valorAvisoPrevio = salarioMensal / 2;
      }

      avisoPrevioIndenizado = valorAvisoPrevio;
    }
  }

  // CORREÇÃO: FGTS e Multa
  if (temFGTS) {
    let saldoFGTS = 0;

    if (tipoContrato === 'experiencia') {
      // Base: 8% sobre salário mensal × meses trabalhados (proporcionalmente)
      saldoFGTS = (tempoContrato / 30) * (salarioMensal * 0.08);
    } else {
      // CORREÇÃO: Incluir dias proporcionais no cálculo do FGTS
      const mesesCompletos = mesesTrabalhados;
      const mesesProporcionais = diasPROPorcionais > 14 ? 1 : (diasPROPorcionais / 30);
      const totalMeses = mesesCompletos + mesesProporcionais;
      saldoFGTS = totalMeses * (salarioMensal * 0.08);
    }

    // Multa do FGTS conforme legislação atual
    if (motivoInfo?.direitos?.multaFgts && motivoInfo?.multaFgtsPercentual) {
      fgtsMulta = saldoFGTS * (motivoInfo.multaFgtsPercentual / 100);
    }

    podeMovimentarFGTS = motivoInfo?.direitos?.fgts || false;

    if (podeMovimentarFGTS && motivoInfo?.fgtsAcessivel) {
      observacoes.push(`Pode sacar ${motivoInfo.fgtsAcessivel}% do FGTS`);
    }
  }

  // Seguro-desemprego
  seguroDesemprego = motivoInfo?.direitos?.seguroDesemprego || false;

  // Observações adicionais
  observacoes = [...observacoes, ...(motivoInfo?.observacoes || [])];

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

/**
 * Calcula férias conforme regras da CLT atualizadas
 * @param mesesTrabalhados - Meses completos trabalhados
 * @param diasProporcionais - Dias do mês incompleto
 * @param salarioMensal - Salário mensal
 * @param motivoRescisao - Motivo da rescisão
 * @returns Valor total das férias (vencidas + proporcionais + 1/3)
 */
function calculateFerias(
  mesesTrabalhados: number, 
  diasProporcionais: number, 
  salarioMensal: number, 
  motivoRescisao: string
): number {
  let totalFerias = 0;
  
  // 1. FÉRIAS VENCIDAS (períodos completos de 12 meses)
  // Todos têm direito às férias vencidas, inclusive justa causa
  const periodosCompletos = Math.floor(mesesTrabalhados / 12);
  if (periodosCompletos > 0) {
    const feriasVencidas = periodosCompletos * salarioMensal;
    const umTercoVencidas = feriasVencidas / 3;
    totalFerias += feriasVencidas + umTercoVencidas;
  }
  
  // 2. FÉRIAS PROPORCIONAIS (período incompleto atual)
  // CORREÇÃO CONFORME CLT: Só tem direito se NÃO foi por justa causa
  if (motivoRescisao !== 'dispensa_com_justa_causa') {
    const mesesProporcional = mesesTrabalhados % 12; // Meses do período incompleto
    
    // CORREÇÃO: Regra dos 15 dias - Se trabalhou mais de 14 dias no mês, conta como mês completo
    const mesesParaCalculo = mesesProporcional + (diasProporcionais > 14 ? 1 : 0);
    
    if (mesesParaCalculo > 0) {
      // CORREÇÃO: Base de cálculo 1/12 por mês trabalhado
      const feriasProporcionais = (mesesParaCalculo / 12) * salarioMensal;
      const umTercoProporcionais = feriasProporcionais / 3;
      totalFerias += feriasProporcionais + umTercoProporcionais;
    }
  }
  
  return totalFerias;
}