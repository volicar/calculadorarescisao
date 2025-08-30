import { CalculatorFormData, CalculationResult } from '@/types/calculator';

export const calculateRescisao = (data: CalculatorFormData): CalculationResult => {
  const salarioMensal = data.salarioMensal;
  const salarioDiario = salarioMensal / 30;
  
  // Calcular dias trabalhados no mês da demissão
  const dataDemissao = new Date(data.dataDemissao);
  const diasTrabalhados = dataDemissao.getDate();
  
  // Saldo de salário
  const saldoSalario = salarioDiario * diasTrabalhados;
  
  // Calcular meses trabalhados
  const dataAdmissao = new Date(data.dataAdmissao);
  const diffTime = dataDemissao.getTime() - dataAdmissao.getTime();
  const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44));
  
  // Férias proporcionais (1/12 por mês trabalhado + 1/3 constitucional)
  const feriasPROPorcionais = (salarioMensal * (diffMonths % 12)) / 12 * (1 + 1/3);
  
  // 13º proporcional
  const decimoTerceiroProporcional = (salarioMensal * (diffMonths % 12)) / 12;
  
  // FGTS + Multa (8% + 40% de multa)
  const fgtsBase = salarioMensal * diffMonths * 0.08;
  const fgtsMulta = data.temFGTS ? fgtsBase * 1.4 : 0; // 8% + 40% de multa
  
  // Aviso prévio indenizado
  const avisoPrevioIndenizado = data.avisoPrevio === 'indenizado' ? salarioMensal : 0;
  
  const total = saldoSalario + feriasPROPorcionais + decimoTerceiroProporcional + fgtsMulta + avisoPrevioIndenizado;
  
  return {
    saldoSalario,
    feriasPROPorcionais,
    decimoTerceiroProporcional,
    fgtsMulta,
    avisoPrevioIndenizado,
    total
  };
};

export const validateDates = (dataAdmissao: string, dataDemissao: string): boolean => {
  const admissao = new Date(dataAdmissao);
  const demissao = new Date(dataDemissao);
  const hoje = new Date();
  
  return admissao < demissao && demissao <= hoje;
};