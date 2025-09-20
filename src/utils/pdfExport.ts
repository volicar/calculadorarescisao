import jsPDF from 'jspdf';
import { CalculatorFormData, CalculationResult } from '@/types/calculator';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface PDFExportData {
  formData: CalculatorFormData;
  result: CalculationResult;
}

// Função auxiliar para formatar o motivo da rescisão
const formatMotivoRescisao = (motivo: string): string => {
  const motivosMap: { [key: string]: string } = {
    'dispensa_sem_justa_causa': 'Dispensa sem Justa Causa',
    'dispensa_com_justa_causa': 'Dispensa com Justa Causa', 
    'pedido_demissao': 'Pedido de Demissão',
    'comum_acordo': 'Comum Acordo',
    'termino_contrato': 'Término do Contrato',
    'aposentadoria': 'Aposentadoria',
    'morte': 'Falecimento',
    'empresa': 'Iniciativa da Empresa',
    'funcionario': 'Iniciativa do Funcionário'
  };

  return motivosMap[motivo] || motivo;
};

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
    addText('CALCULADORA DE RESCISÃO TRABALHISTA', margin, yPosition, {
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

    const dadosFuncionario = [];
    
    // Adicionar nome se fornecido
    if (formData.nome && formData.nome.trim()) {
      dadosFuncionario.push(['Nome:', formData.nome]);
    }
    
    dadosFuncionario.push(
      ['Tipo de Contrato:', formData.tipoContrato === 'normal' ? 'Normal' : 'Experiência'],
      ['Salário Mensal:', formatCurrency(formData.salarioMensal)],
      ['Data de Admissão:', formatDate(formData.dataAdmissao)],
      ['Data de Demissão:', formatDate(formData.dataDemissao)]
    );

    // CORREÇÃO: Campos específicos por tipo de contrato
    if (formData.tipoContrato === 'experiencia') {
      // Para experiência: apenas dias trabalhados (SEM motivo da rescisão)
      dadosFuncionario.push(['Dias Trabalhados:', `${formData.tempoContrato} dias`]);
    } else {
      // Para contrato normal: motivo da rescisão + aviso prévio
      dadosFuncionario.push(
        ['Motivo da Rescisão:', formatMotivoRescisao(formData.motivoRescisao)],
        ['Aviso Prévio:', 
          formData.avisoPrevio === 'indenizado' ? 'Indenizado' : 
          formData.avisoPrevio === 'trabalhado' ? 'Trabalhado' : 'Não Aplicável'
        ]
      );
    }

    dadosFuncionario.push(['FGTS:', formData.temFGTS ? 'Sim' : 'Não']);

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
      ['FGTS + Multa (40%)', result.fgtsMulta]
    ];

    // Adicionar aviso prévio indenizado apenas se houver valor
    if (result.avisoPrevioIndenizado && result.avisoPrevioIndenizado > 0) {
      calculosRescisao.push(['Aviso Prévio Indenizado', result.avisoPrevioIndenizado]);
    }

    // Adicionar indenização de experiência apenas se houver valor
    if (result.indenizacaoExperiencia && result.indenizacaoExperiencia > 0) {
      calculosRescisao.push(['Indenização Contrato Experiência', result.indenizacaoExperiencia]);
    }

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
    
    addText('Rescisão - www.rescisaonline.com.br', margin, yPosition, {
      fontSize: 8,
      align: 'right'
    });

    // DOWNLOAD
    const nomeArquivo = formData.nome && formData.nome.trim() 
      ? `rescisao-${formData.nome.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`
      : `rescisao-trabalhista-${new Date().toISOString().split('T')[0]}.pdf`;
    
    pdf.save(nomeArquivo);
    
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw new Error('Não foi possível gerar o PDF. Tente novamente.');
  }
};

// Função alternativa para dispositivos móveis que podem ter problemas com jsPDF
export const generateTextFile = ({ formData, result }: PDFExportData): void => {
  let content = `
 CALCULADORA DE RESCISÃO TRABALHISTA 
=====================================

DADOS DO FUNCIONÁRIO:`;

  // Adicionar nome se fornecido
  if (formData.nome && formData.nome.trim()) {
    content += `\nNome: ${formData.nome}`;
  }

  content += `
Tipo de Contrato: ${formData.tipoContrato === 'normal' ? 'Normal' : 'Experiência'}
Salário Mensal: ${formatCurrency(formData.salarioMensal)}
Data de Admissão: ${formatDate(formData.dataAdmissao)}
Data de Demissão: ${formatDate(formData.dataDemissao)}`;

  // CORREÇÃO: Campos específicos por tipo de contrato
  if (formData.tipoContrato === 'experiencia') {
    // Para experiência: apenas dias trabalhados (SEM motivo da rescisão)
    content += `
Dias Trabalhados: ${formData.tempoContrato} dias`;
  } else {
    // Para contrato normal: motivo da rescisão + aviso prévio
    content += `
Motivo da Rescisão: ${formatMotivoRescisao(formData.motivoRescisao)}
Aviso Prévio: ${formData.avisoPrevio === 'indenizado' ? 'Indenizado' : 
               formData.avisoPrevio === 'trabalhado' ? 'Trabalhado' : 'Não Aplicável'}`;
  }

  content += `
FGTS: ${formData.temFGTS ? 'Sim' : 'Não'}

CÁLCULOS DA RESCISÃO:
Saldo de Salário: ${formatCurrency(result.saldoSalario)}
Férias Proporcionais: ${formatCurrency(result.feriasPROPorcionais)}
13º Proporcional: ${formatCurrency(result.decimoTerceiroProporcional)}
FGTS + Multa (40%): ${formatCurrency(result.fgtsMulta)}`;

  // Adicionar valores condicionais
  if (result.avisoPrevioIndenizado && result.avisoPrevioIndenizado > 0) {
    content += `\nAviso Prévio Indenizado: ${formatCurrency(result.avisoPrevioIndenizado)}`;
  }

  if (result.indenizacaoExperiencia && result.indenizacaoExperiencia > 0) {
    content += `\nIndenização Contrato Experiência: ${formatCurrency(result.indenizacaoExperiencia)}`;
  }

  content += `

VALOR TOTAL: ${formatCurrency(result.total)}

Calculado em: ${new Date().toLocaleString('pt-BR')}
Rescisão - Calculadora Trabalhista`;

  const element = document.createElement('a');
  const file = new Blob([content.trim()], { type: 'text/plain;charset=utf-8' });
  element.href = URL.createObjectURL(file);
  
  const nomeArquivo = formData.nome && formData.nome.trim() 
    ? `rescisao-${formData.nome.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`
    : `rescisao-trabalhista-${new Date().toISOString().split('T')[0]}.txt`;
  
  element.download = nomeArquivo;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

// Função CORRIGIDA para gerar mensagem para WhatsApp
export const generateWhatsAppMessage = ({ formData, result }: PDFExportData): string => {
  let message = `🧾 *CÁLCULO DE RESCISÃO TRABALHISTA*\n\n`;

  message += `📊 *DADOS:*\n`;

  // Adicionar nome se fornecido
  if (formData.nome && formData.nome.trim()) {
    message += `👤 Nome: ${formData.nome}\n`;
  }

  // Adicionar tipo de contrato sempre
  message += `📋 Tipo de Contrato: ${formData.tipoContrato === 'normal' ? 'Normal' : 'Experiência'}\n`;
  
  message += `💰 Salário: ${formatCurrency(formData.salarioMensal)}\n`;
  message += `📅 Admissão: ${formatDate(formData.dataAdmissao)}\n`;
  message += `📅 Demissão: ${formatDate(formData.dataDemissao)}\n`;

  // CORREÇÃO: Campos específicos por tipo de contrato
  if (formData.tipoContrato === 'experiencia') {
    // Para experiência: apenas dias trabalhados (SEM motivo da rescisão)
    message += `⏰ Dias Trabalhados: ${formData.tempoContrato} dias\n`;
  } else {
    // Para contrato normal: motivo da rescisão + aviso prévio
    message += `❓ Motivo da Rescisão: ${formatMotivoRescisao(formData.motivoRescisao)}\n`;
    const avisoPrevio = formData.avisoPrevio === 'indenizado' ? 'Indenizado' : 
                       formData.avisoPrevio === 'trabalhado' ? 'Trabalhado' : 'Não Aplicável';
    message += `⏰ Aviso Prévio: ${avisoPrevio}\n`;
  }

  // Sempre mostrar FGTS
  message += `🏦 FGTS: ${formData.temFGTS ? 'Sim' : 'Não'}\n`;

  message += `\n💰 *VALORES A RECEBER:*\n`;
  message += `• Saldo de Salário: ${formatCurrency(result.saldoSalario)}\n`;
  message += `• Férias Proporcionais: ${formatCurrency(result.feriasPROPorcionais)}\n`;
  message += `• 13º Proporcional: ${formatCurrency(result.decimoTerceiroProporcional)}\n`;
  message += `• FGTS + Multa: ${formatCurrency(result.fgtsMulta)}\n`;

  // Adicionar valores condicionais
  if (result.avisoPrevioIndenizado && result.avisoPrevioIndenizado > 0) {
    message += `• Aviso Prévio Indenizado: ${formatCurrency(result.avisoPrevioIndenizado)}\n`;
  }

  if (result.indenizacaoExperiencia && result.indenizacaoExperiencia > 0) {
    message += `• Indenização Experiência: ${formatCurrency(result.indenizacaoExperiencia)}\n`;
  }

  message += `\n🎯 *TOTAL: ${formatCurrency(result.total)}*\n\n`;
  
  message += `*Calculado em: ${new Date().toLocaleString('pt-BR')}*\n`;
  message += `*Rescisão 2025 - Calculadora Trabalhista*\n\n`;
  message += `👉 Acesse: https://www.rescisaonline.com.br`;

  return message;
};

// Função para copiar texto (alternativa ao WhatsApp)
export const generateCopyText = ({ formData, result }: PDFExportData): string => {
  return generateWhatsAppMessage({ formData, result });
};

// EXEMPLOS DE USO:

// Para WhatsApp:
// const message = generateWhatsAppMessage({ formData, result });
// const encodedMessage = encodeURIComponent(message);
// const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
// window.open(whatsappUrl, '_blank');

// Para copiar para área de transferência:
// const text = generateCopyText({ formData, result });
// navigator.clipboard.writeText(text);

// Para gerar PDF:
// await generatePDF({ formData, result });

// Para gerar arquivo TXT:
// generateTextFile({ formData, result });