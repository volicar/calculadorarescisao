export interface CalculatorFormData {
  salarioMensal: number;
  dataAdmissao: string;
  dataDemissao: string;
  avisoPrevio: 'indenizado' | 'trabalhado' | 'nao_aplicavel';
  temFGTS: boolean;
  periodoFerias: number; // meses de férias proporcionais
}

export interface CalculationResult {
  saldoSalario: number;
  feriasPROPorcionais: number;
  decimoTerceiroProporcional: number;
  fgtsMulta: number;
  avisoPrevioIndenizado: number;
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