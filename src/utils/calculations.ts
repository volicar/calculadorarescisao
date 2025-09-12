import { CalculatorFormData, CalculationResult } from '@/types/calculator';

export const calculateRescisao = (data: CalculatorFormData): CalculationResult => {
  const salarioMensal = data.salarioMensal;
  const salarioDiario = salarioMensal / 30;
  
  const dataDemissao = new Date(data.dataDemissao);
  const diasTrabalhados = dataDemissao.getDate();
  const saldoSalario = salarioDiario * diasTrabalhados;
  
  const dataAdmissao = new Date(data.dataAdmissao);
  const diffTime = dataDemissao.getTime() - dataAdmissao.getTime();
  const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44));
  
  const isContratoExperiencia = data.tipoContrato === 'experiencia';
  
  const feriasPROPorcionais = isContratoExperiencia && data.motivoRescisao !== 'empresa' 
    ? 0 
    : (salarioMensal * (diffMonths % 12)) / 12 * (1 + 1/3);
  
  const decimoTerceiroProporcional = isContratoExperiencia && data.motivoRescisao !== 'empresa'
    ? 0
    : (salarioMensal * (diffMonths % 12)) / 12;
  
  const fgtsBase = salarioMensal * diffMonths * 0.08;
  const fgtsMulta = data.temFGTS 
    ? (isContratoExperiencia && data.motivoRescisao === 'empresa' ? fgtsBase * 1.4 : 0)
    : 0;
  
  const avisoPrevioIndenizado = isContratoExperiencia 
    ? 0 
    : (data.avisoPrevio === 'indenizado' ? salarioMensal : 0);
    
  const indenizacaoExperiencia = isContratoExperiencia 
    ? calcularIndenizacaoExperiencia(data.motivoRescisao, salarioMensal, data.tempoContrato)
    : 0;
  
  const total = saldoSalario + feriasPROPorcionais + decimoTerceiroProporcional + 
                fgtsMulta + avisoPrevioIndenizado + indenizacaoExperiencia;
  
  return {
    saldoSalario,
    feriasPROPorcionais,
    decimoTerceiroProporcional,
    fgtsMulta,
    avisoPrevioIndenizado,
    indenizacaoExperiencia,
    total
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

export const validateDates = (dataAdmissao: string, dataDemissao: string): boolean => {
  const admissao = new Date(dataAdmissao);
  const demissao = new Date(dataDemissao);
  const hoje = new Date();
  
  return admissao < demissao && demissao <= hoje;
};