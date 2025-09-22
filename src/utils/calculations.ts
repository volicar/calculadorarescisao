import { CalculatorFormData, CalculationResult } from '@/types/calculator';

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

// Função para determinar os direitos baseados no motivo de rescisão
const getMotivoRescisaoInfo = (motivo: string, tipoContrato: string = 'normal') => {
  const info = {
    temDireitoAvisoPrevio: false,
    temDireitoMultaFGTS: false,
    percentualMultaFGTS: 0,
    temDireitoFerias: true, // Na maioria dos casos tem direito
    temDireito13: true, // Na maioria dos casos tem direito
    temDireitoSeguroDesemprego: false,
    podeMovimentarFGTS: false
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
      info.temDireitoFerias = false; // Apenas férias vencidas, não proporcionais
      info.temDireito13 = false; // CLT nega 13º proporcional para justa causa
      info.temDireitoSeguroDesemprego = false;
      info.podeMovimentarFGTS = false;
      break;

    case 'pedido_demissao':
      info.temDireitoAvisoPrevio = false; // Funcionário deve cumprir aviso
      info.temDireitoMultaFGTS = false;
      info.temDireitoSeguroDesemprego = false;
      info.podeMovimentarFGTS = false;
      break;

    case 'comum_acordo':
      info.temDireitoAvisoPrevio = true; // 50% do valor
      info.temDireitoMultaFGTS = true;
      info.percentualMultaFGTS = 20; // Lei 13.467/2017
      info.temDireitoSeguroDesemprego = false;
      info.podeMovimentarFGTS = true; // 80% do saldo
      break;

    case 'termino_contrato':
    case 'aposentadoria':
      info.temDireitoAvisoPrevio = false;
      info.temDireitoMultaFGTS = false;
      info.temDireitoSeguroDesemprego = false;
      info.podeMovimentarFGTS = true;
      break;

    default:
      // Dispensa sem justa causa como padrão
      info.temDireitoAvisoPrevio = true;
      info.temDireitoMultaFGTS = true;
      info.percentualMultaFGTS = 40;
      info.temDireitoSeguroDesemprego = true;
      info.podeMovimentarFGTS = true;
      break;
  }

  return info;
};

// Função para calcular anos trabalhados (para aviso prévio progressivo)
const calculateYearsWorked = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  let years = end.getFullYear() - start.getFullYear();
  if (end.getMonth() < start.getMonth() || 
      (end.getMonth() === start.getMonth() && end.getDate() < start.getDate())) {
    years--;
  }
  
  return Math.max(0, years);
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

  // Usar motivo informado ou padrão
  const motivoFinal = motivoRescisao || 'dispensa_sem_justa_causa';
  
  // Obter informações dos direitos baseados no motivo
  const direitos = getMotivoRescisaoInfo(motivoFinal, tipoContrato);

  // Variáveis de resultado
  let saldoSalario = 0;
  let feriasPROPorcionais = 0;
  let decimoTerceiroProporcional = 0;
  let fgtsMulta = 0;
  let avisoPrevioIndenizado = 0;
  let indenizacaoExperiencia = 0;

  const salarioDiario = salarioMensal / 30;

  if (tipoContrato === 'experiencia') {
    // === CÁLCULOS PARA CONTRATO DE EXPERIÊNCIA ===
    const diasTrabalhados = tempoContrato || 0;
    
    // 1. SALDO DE SALÁRIO - sempre pago
    saldoSalario = diasTrabalhados * salarioDiario;

    // 2. INDENIZAÇÃO POR RESCISÃO ANTECIPADA (Art. 479 CLT)
    if (motivoFinal === 'dispensa_sem_justa_causa' && diasTrabalhados < 90) {
      const diasRestantes = 90 - diasTrabalhados;
      // 50% da remuneração dos dias restantes
      indenizacaoExperiencia = (diasRestantes / 2) * salarioDiario;
    }

    // 3. FÉRIAS PROPORCIONAIS
    if (direitos.temDireitoFerias && diasTrabalhados > 15) {
      // Proporcional aos dias trabalhados
      const valorFerias = (diasTrabalhados / 360) * salarioMensal; // Base anual
      const umTerco = valorFerias / 3;
      feriasPROPorcionais = valorFerias + umTerco;
    }

    // 4. 13º PROPORCIONAL
    if (direitos.temDireito13 && diasTrabalhados >= 15) {
      // Proporcional aos dias trabalhados
      decimoTerceiroProporcional = (diasTrabalhados / 360) * salarioMensal;
    }

    // 5. FGTS + MULTA
    if (temFGTS) {
      const saldoFGTS = (diasTrabalhados / 30) * (salarioMensal * 0.08);
      
      if (direitos.temDireitoMultaFGTS && direitos.percentualMultaFGTS > 0) {
        const valorMulta = saldoFGTS * (direitos.percentualMultaFGTS / 100);
        fgtsMulta = saldoFGTS + valorMulta;
      } else {
        fgtsMulta = saldoFGTS; // Apenas o valor depositado, sem multa
      }
    }

  } else {
    // === CÁLCULOS PARA CONTRATO NORMAL ===
    const mesesTrabalhados = calculateMonthsDifference(dataAdmissao, dataDemissao);
    const diasPROPorcionais = calculateProportionalDays(dataAdmissao, dataDemissao);
    const anosTrabalhados = calculateYearsWorked(dataAdmissao, dataDemissao);

    // 1. SALDO DE SALÁRIO - sempre pago
    saldoSalario = diasPROPorcionais * salarioDiario;

    // 2. FÉRIAS PROPORCIONAIS E VENCIDAS
    if (direitos.temDireitoFerias) {
      // Férias proporcionais normais
      const mesesParaFerias = mesesTrabalhados + (diasPROPorcionais > 14 ? 1 : 0);
      if (mesesParaFerias > 0) {
        const valorFerias = (mesesParaFerias / 12) * salarioMensal;
        const umTerco = valorFerias / 3;
        feriasPROPorcionais = valorFerias + umTerco;
      }
    } else if (motivoFinal === 'dispensa_com_justa_causa') {
      // Para justa causa: apenas férias vencidas (períodos completos de 12 meses)
      const periodosCompletos = Math.floor(mesesTrabalhados / 12);
      if (periodosCompletos > 0) {
        const feriasVencidas = periodosCompletos * salarioMensal;
        const umTercoVencidas = feriasVencidas / 3;
        feriasPROPorcionais = feriasVencidas + umTercoVencidas;
      }
    }

    // 3. 13º PROPORCIONAL
    if (direitos.temDireito13) {
      const mesesPara13 = mesesTrabalhados + (diasPROPorcionais > 14 ? 1 : 0);
      if (mesesPara13 > 0) {
        decimoTerceiroProporcional = (mesesPara13 / 12) * salarioMensal;
      }
    }

    // 4. AVISO PRÉVIO INDENIZADO
    if (direitos.temDireitoAvisoPrevio && avisoPrevio === 'indenizado') {
      // Aviso prévio progressivo: 30 dias + 3 dias por ano trabalhado (máximo 90 dias)
      const diasAvisoPrevio = Math.min(30 + (anosTrabalhados * 3), 90);
      let valorAvisoPrevio = (diasAvisoPrevio / 30) * salarioMensal;

      // Para comum acordo, é 50% do aviso prévio
      if (motivoFinal === 'comum_acordo') {
        valorAvisoPrevio = valorAvisoPrevio / 2;
      }

      avisoPrevioIndenizado = valorAvisoPrevio;
    }

    // 5. FGTS + MULTA
    if (temFGTS) {
      // Base de cálculo: 8% sobre todos os salários
      const mesesCompletos = mesesTrabalhados;
      const fracaoMes = diasPROPorcionais > 14 ? 1 : (diasPROPorcionais / 30);
      const totalMesesFGTS = mesesCompletos + fracaoMes;
      
      const saldoFGTS = totalMesesFGTS * (salarioMensal * 0.08);
      
      if (direitos.temDireitoMultaFGTS && direitos.percentualMultaFGTS > 0) {
        const valorMulta = saldoFGTS * (direitos.percentualMultaFGTS / 100);
        fgtsMulta = saldoFGTS + valorMulta;
      } else {
        fgtsMulta = saldoFGTS; // Apenas o valor depositado, sem multa
      }
    }
  }

  // TOTAL GERAL
  const total = saldoSalario + feriasPROPorcionais + decimoTerceiroProporcional +
                fgtsMulta + avisoPrevioIndenizado + indenizacaoExperiencia;

  return {
    saldoSalario: Math.max(0, Number(saldoSalario.toFixed(2))),
    feriasPROPorcionais: Math.max(0, Number(feriasPROPorcionais.toFixed(2))),
    decimoTerceiroProporcional: Math.max(0, Number(decimoTerceiroProporcional.toFixed(2))),
    fgtsMulta: Math.max(0, Number(fgtsMulta.toFixed(2))),
    avisoPrevioIndenizado: Math.max(0, Number(avisoPrevioIndenizado.toFixed(2))),
    indenizacaoExperiencia: Math.max(0, Number(indenizacaoExperiencia.toFixed(2))),
    total: Math.max(0, Number(total.toFixed(2)))
  };
};

/**
 * Calcula férias conforme regras da CLT
 * @param mesesTrabalhados - Meses completos trabalhados
 * @param diasProporcionais - Dias do mês incompleto
 * @param salarioMensal - Salário mensal
 * @param motivoRescisao - Motivo da rescisão
 * @returns Valor total das férias (vencidas + proporcionais + 1/3)
 */
export function calculateFerias(
  mesesTrabalhados: number, 
  diasProporcionais: number, 
  salarioMensal: number, 
  motivoRescisao: string
): number {
  let totalFerias = 0;
  
  // 1. FÉRIAS VENCIDAS (períodos completos de 12 meses)
  const periodosCompletos = Math.floor(mesesTrabalhados / 12);
  if (periodosCompletos > 0) {
    const feriasVencidas = periodosCompletos * salarioMensal;
    const umTercoVencidas = feriasVencidas / 3;
    totalFerias += feriasVencidas + umTercoVencidas;
  }
  
  // 2. FÉRIAS PROPORCIONAIS (período incompleto atual)
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