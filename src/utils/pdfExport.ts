import jsPDF from 'jspdf';
import { CalculatorFormData, CalculationResult } from '@/types/calculator';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface PDFExportData {
  formData: CalculatorFormData;
  result: CalculationResult;
}

export const generatePDF = async ({ formData, result }: PDFExportData): Promise<void> => {
  try {
    // Criar instância do PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Configurações de estilo
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    // Função para adicionar texto com quebra de linha automática
    const addText = (text: string, x: number, y: number, options: { 
      fontSize?: number, 
      fontStyle?: string, 
      maxWidth?: number,
      align?: 'left' | 'center' | 'right'
    } = {}) => {
      const { fontSize = 10, fontStyle = 'normal', maxWidth = contentWidth, align = 'left' } = options;
      
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', fontStyle);
      
      if (align === 'center') {
        pdf.text(text, pageWidth / 2, y, { align: 'center', maxWidth });
      } else if (align === 'right') {
        pdf.text(text, pageWidth - margin, y, { align: 'right', maxWidth });
      } else {
        pdf.text(text, x, y, { maxWidth });
      }
      
      return pdf.getTextDimensions(text).h + 2;
    };

    // Função para adicionar linha
    const addLine = (y: number, color: string = '#e5e7eb') => {
      pdf.setDrawColor(color);
      pdf.setLineWidth(0.5);
      pdf.line(margin, y, pageWidth - margin, y);
      return 5;
    };

    // CABEÇALHO
    pdf.setFillColor(34, 197, 94); // Primary green
    pdf.rect(0, 0, pageWidth, 25, 'F');
    
    yPosition = 15;
    addText('CALCULADORA DE RESCISÃO TRABALHISTA 2025', margin, yPosition, {
      fontSize: 16,
      fontStyle: 'bold',
      align: 'center'
    });

    yPosition = 35;

    // DADOS DO FUNCIONÁRIO
    yPosition += addText('DADOS DO FUNCIONÁRIO', margin, yPosition, {
      fontSize: 14,
      fontStyle: 'bold'
    });
    
    yPosition += 5;
    yPosition += addLine(yPosition);
    yPosition += 5;

    const dadosFuncionario = [
      ['Salário Mensal:', formatCurrency(formData.salarioMensal)],
      ['Data de Admissão:', formatDate(formData.dataAdmissao)],
      ['Data de Demissão:', formatDate(formData.dataDemissao)],
      ['Aviso Prévio:', formData.avisoPrevio === 'indenizado' ? 'Indenizado' : 
                       formData.avisoPrevio === 'trabalhado' ? 'Trabalhado' : 'Não Aplicável'],
      ['FGTS:', formData.temFGTS ? 'Sim' : 'Não']
    ];

    dadosFuncionario.forEach(([label, value]) => {
      yPosition += addText(label, margin, yPosition, { fontSize: 10, fontStyle: 'bold' });
      addText(value, margin + 50, yPosition - 4, { fontSize: 10 });
      yPosition += 2;
    });

    yPosition += 10;

    // CÁLCULOS DA RESCISÃO
    yPosition += addText('CÁLCULOS DA RESCISÃO', margin, yPosition, {
      fontSize: 14,
      fontStyle: 'bold'
    });
    
    yPosition += 5;
    yPosition += addLine(yPosition);
    yPosition += 5;

    const calculosRescisao = [
      ['Saldo de Salário', result.saldoSalario],
      ['Férias Proporcionais', result.feriasPROPorcionais],
      ['13º Proporcional', result.decimoTerceiroProporcional],
      ['FGTS + Multa (40%)', result.fgtsMulta],
      ['Aviso Prévio Indenizado', result.avisoPrevioIndenizado || 0]
    ];

    calculosRescisao.forEach(([label, value]) => {
      yPosition += addText(label as string, margin, yPosition, { fontSize: 10 });
      addText(formatCurrency(value as number), margin, yPosition - 4, { 
        fontSize: 10, 
        align: 'right' 
      });
      yPosition += 2;
    });

    yPosition += 10;
    yPosition += addLine(yPosition, '#22c55e');
    yPosition += 5;

    // TOTAL
    yPosition += addText('VALOR TOTAL DA RESCISÃO', margin, yPosition, {
      fontSize: 12,
      fontStyle: 'bold'
    });
    
    addText(formatCurrency(result.total), margin, yPosition - 4, {
      fontSize: 14,
      fontStyle: 'bold',
      align: 'right'
    });

    yPosition += 15;

    // OBSERVAÇÕES
    yPosition += addText('OBSERVAÇÕES IMPORTANTES', margin, yPosition, {
      fontSize: 12,
      fontStyle: 'bold'
    });
    
    yPosition += 5;
    yPosition += addLine(yPosition);
    yPosition += 5;

    const observacoes = [
      '• Este cálculo é uma estimativa baseada nas informações fornecidas.',
      '• Os valores podem variar conforme convenções coletivas específicas.',
      '• Consulte sempre um advogado trabalhista para orientação jurídica.',
      '• Mantenha toda a documentação trabalhista organizada.',
      '• Verifique se há acordos específicos em seu contrato de trabalho.'
    ];

    observacoes.forEach(obs => {
      yPosition += addText(obs, margin, yPosition, { fontSize: 9 });
      yPosition += 2;
    });

    // RODAPÉ
    const footerY = pdf.internal.pageSize.getHeight() - 20;
    yPosition = footerY - 10;
    
    yPosition += addLine(yPosition, '#e5e7eb');
    yPosition += 5;
    
    addText(`Calculado em: ${new Date().toLocaleString('pt-BR')}`, margin, yPosition, {
      fontSize: 8,
      align: 'left'
    });
    
    addText('Rescisão 2025 - www.rescisao2025.com.br', margin, yPosition, {
      fontSize: 8,
      align: 'right'
    });

    // DOWNLOAD
    const fileName = `rescisao-trabalhista-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw new Error('Não foi possível gerar o PDF. Tente novamente.');
  }
};

// Função alternativa para dispositivos móveis que podem ter problemas com jsPDF
export const generateTextFile = ({ formData, result }: PDFExportData): void => {
  const content = `
CALCULADORA DE RESCISÃO TRABALHISTA 2025
=====================================

DADOS DO FUNCIONÁRIO:
Salário Mensal: ${formatCurrency(formData.salarioMensal)}
Data de Admissão: ${formatDate(formData.dataAdmissao)}
Data de Demissão: ${formatDate(formData.dataDemissao)}
Aviso Prévio: ${formData.avisoPrevio === 'indenizado' ? 'Indenizado' : 
               formData.avisoPrevio === 'trabalhado' ? 'Trabalhado' : 'Não Aplicável'}

CÁLCULOS DA RESCISÃO:
Saldo de Salário: ${formatCurrency(result.saldoSalario)}
Férias Proporcionais: ${formatCurrency(result.feriasPROPorcionais)}
13º Proporcional: ${formatCurrency(result.decimoTerceiroProporcional)}
FGTS + Multa (40%): ${formatCurrency(result.fgtsMulta)}
Aviso Prévio Indenizado: ${formatCurrency(result.avisoPrevioIndenizado || 0)}

VALOR TOTAL: ${formatCurrency(result.total)}

Calculado em: ${new Date().toLocaleString('pt-BR')}
Rescisão 2025 - Calculadora Trabalhista
  `.trim();

  const element = document.createElement('a');
  const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
  element.href = URL.createObjectURL(file);
  element.download = `rescisao-trabalhista-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};