export interface CalculatorFormData {
  salarioMensal: number;
  dataAdmissao: string;
  dataDemissao: string;
  temFGTS: boolean;
  avisoPrevio: 'trabalhado' | 'indenizado';
  tipoContrato: 'normal' | 'experiencia';
  motivoRescisao: 'empresa' | 'funcionario';
  tempoContrato: number;
}

export interface CalculationResult {
  saldoSalario: number;
  feriasPROPorcionais: number;
  decimoTerceiroProporcional: number;
  fgtsMulta: number;
  avisoPrevioIndenizado: number;
  indenizacaoExperiencia: number;
  total: number;
}

export interface CalculatorProps {
  onCalculate?: (result: CalculationResult) => void;
}

export interface ExportData {
  formData: CalculatorFormData;
  result: CalculationResult;
  calculatedAt: string;
}