import jsPDF from 'jspdf';
import { CalculatorFormData, CalculationResult } from '@/types/calculator';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface PDFExportData {
  formData: CalculatorFormData;
  result: CalculationResult;
}

const formatMotivoRescisao = (motivo: string): string => {
  const motivosMap: Record<string, string> = {
    dispensa_sem_justa_causa: 'Dispensa sem Justa Causa',
    dispensa_com_justa_causa: 'Dispensa com Justa Causa',
    pedido_demissao: 'Pedido de Demissão',
    comum_acordo: 'Comum Acordo',
    termino_contrato: 'Término do Contrato',
    aposentadoria: 'Aposentadoria',
  };
  return motivosMap[motivo] || motivo;
};

export const generatePDF = async ({ formData, result }: PDFExportData): Promise<void> => {
  try {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let y = margin;

    const addText = (text: string, x: number, yPos: number, opts: {
      fontSize?: number; fontStyle?: string; align?: 'left' | 'center' | 'right'; color?: [number, number, number];
    } = {}) => {
      const { fontSize = 10, fontStyle = 'normal', align = 'left', color } = opts;
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', fontStyle);
      if (color) pdf.setTextColor(...color);
      else pdf.setTextColor(30, 30, 30);

      if (align === 'center') pdf.text(text, pageWidth / 2, yPos, { align: 'center' });
      else if (align === 'right') pdf.text(text, pageWidth - margin, yPos, { align: 'right' });
      else pdf.text(text, x, yPos);

      return pdf.getTextDimensions(text).h + 2;
    };

    const addLine = (yPos: number, r = 200, g = 200, b = 200) => {
      pdf.setDrawColor(r, g, b);
      pdf.setLineWidth(0.3);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      return 5;
    };

    const section = (title: string, yPos: number) => {
      pdf.setFillColor(240, 253, 244);
      pdf.rect(margin, yPos - 4, pageWidth - margin * 2, 8, 'F');
      addText(title, margin + 2, yPos + 1, { fontSize: 11, fontStyle: 'bold', color: [21, 128, 61] });
      return 12;
    };

    // Cabeçalho
    pdf.setFillColor(34, 197, 94);
    pdf.rect(0, 0, pageWidth, 28, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CALCULADORA DE RESCISÃO TRABALHISTA', pageWidth / 2, 12, { align: 'center' });
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text('www.rescisaonline.com.br', pageWidth / 2, 20, { align: 'center' });
    y = 36;

    // Dados do funcionário
    y += section('DADOS DO FUNCIONÁRIO', y);
    y += addLine(y);

    const dados: [string, string][] = [];
    if (formData.nome?.trim()) dados.push(['Nome', formData.nome]);
    dados.push(['Tipo de Contrato', formData.tipoContrato === 'normal' ? 'Normal' : 'Experiência']);
    dados.push(['Salário Mensal', formatCurrency(formData.salarioMensal)]);
    if ((formData.comissoes ?? 0) > 0) dados.push(['Comissões', formatCurrency(formData.comissoes!)]);
    if ((formData.adicionaisHabituais ?? 0) > 0) dados.push(['Adicionais Habituais', formatCurrency(formData.adicionaisHabituais!)]);
    dados.push(['Data de Admissão', formatDate(formData.dataAdmissao)]);
    dados.push(['Data de Demissão', formatDate(formData.dataDemissao)]);

    if (formData.tipoContrato === 'experiencia') {
      dados.push(['Dias Trabalhados', `${formData.tempoContrato} dias`]);
    } else {
      dados.push(['Motivo da Rescisão', formData.motivoRescisao ? formatMotivoRescisao(formData.motivoRescisao) : 'Não informado']);
      dados.push(['Aviso Prévio', formData.avisoPrevio === 'indenizado' ? 'Indenizado' : formData.avisoPrevio === 'trabalhado' ? 'Trabalhado' : 'Não Aplicável']);
    }
    dados.push(['FGTS', formData.temFGTS ? 'Sim' : 'Não']);
    if ((formData.numeroDependentesIR ?? 0) > 0) dados.push(['Dependentes IR', String(formData.numeroDependentesIR)]);

    dados.forEach(([label, value]) => {
      addText(label + ':', margin, y, { fontSize: 9, fontStyle: 'bold', color: [70, 70, 70] });
      addText(value, margin + 55, y, { fontSize: 9, color: [20, 20, 20] });
      y += 6;
    });

    y += 6;

    // Verbas
    y += section('VERBAS RESCISÓRIAS (BRUTO)', y);
    y += addLine(y);

    const verbas: [string, number][] = [
      ['Saldo de Salário', result.saldoSalario],
      ['Férias Proporcionais + 1/3', result.feriasPROPorcionais],
      ['13° Proporcional', result.decimoTerceiroProporcional],
      ['FGTS + Multa', result.fgtsMulta],
    ];
    if (result.avisoPrevioIndenizado > 0) verbas.push(['Aviso Prévio Indenizado', result.avisoPrevioIndenizado]);
    if (result.indenizacaoExperiencia > 0) verbas.push(['Indenização Contrato Experiência', result.indenizacaoExperiencia]);

    verbas.forEach(([label, value]) => {
      addText(label, margin, y, { fontSize: 9, color: [50, 50, 50] });
      addText(formatCurrency(value), pageWidth - margin, y, { fontSize: 9, fontStyle: 'bold', align: 'right', color: [20, 20, 20] });
      y += 6;
    });

    y += 3;
    addLine(y, 34, 197, 94);
    y += 6;
    addText('TOTAL BRUTO', margin, y, { fontSize: 12, fontStyle: 'bold', color: [20, 20, 20] });
    addText(formatCurrency(result.total), pageWidth - margin, y, { fontSize: 12, fontStyle: 'bold', align: 'right', color: [21, 128, 61] });
    y += 10;

    // Deduções
    if (result.deducaoINSS > 0 || result.deducaoIRRF > 0) {
      y += section('DEDUÇÕES ESTIMADAS', y);
      y += addLine(y);

      if (result.deducaoINSS > 0) {
        addText('INSS (Previdência Social)', margin, y, { fontSize: 9, color: [50, 50, 50] });
        addText('- ' + formatCurrency(result.deducaoINSS), pageWidth - margin, y, { fontSize: 9, align: 'right', color: [180, 50, 50] });
        y += 6;
      }
      if (result.deducaoIRRF > 0) {
        addText('IRRF (Imposto de Renda)', margin, y, { fontSize: 9, color: [50, 50, 50] });
        addText('- ' + formatCurrency(result.deducaoIRRF), pageWidth - margin, y, { fontSize: 9, align: 'right', color: [180, 50, 50] });
        y += 6;
      }

      y += 3;
      addLine(y, 34, 197, 94);
      y += 6;
      addText('ESTIMATIVA LÍQUIDA', margin, y, { fontSize: 12, fontStyle: 'bold', color: [20, 20, 20] });
      addText(formatCurrency(result.totalLiquido), pageWidth - margin, y, { fontSize: 12, fontStyle: 'bold', align: 'right', color: [21, 128, 61] });
      y += 10;

      addText('* Férias indenizadas são isentas de IRRF (Lei 7.713/88, art. 6°, V)', margin, y, { fontSize: 7, color: [120, 120, 120] });
      y += 8;
    }

    // Seguro Desemprego
    if (result.seguroDesemprego.temDireito) {
      y += section('SEGURO DESEMPREGO', y);
      y += addLine(y);
      addText(`Parcelas: ${result.seguroDesemprego.numeroParcelas}`, margin, y, { fontSize: 9, color: [50, 50, 50] });
      addText(`Valor/parcela estimado: ${formatCurrency(result.seguroDesemprego.valorEstimadoParcela)}`, margin + 50, y, { fontSize: 9, color: [50, 50, 50] });
      y += 6;
      addText(`Total estimado: ${formatCurrency(result.seguroDesemprego.totalEstimado)}`, margin, y, { fontSize: 9, fontStyle: 'bold', color: [21, 128, 61] });
      y += 10;
    }

    // Prazo pagamento
    if (result.prazoLimitePagamento) {
      y += section('PRAZO DE PAGAMENTO', y);
      y += addLine(y);
      addText(`Prazo limite: ${formatDate(result.prazoLimitePagamento)} (10 dias corridos — Art. 477 §6° CLT)`, margin, y, { fontSize: 9, color: [50, 50, 50] });
      y += 10;
    }

    // Observações
    y += section('OBSERVAÇÕES', y);
    y += addLine(y);
    const obs = [
      '• Cálculo estimativo baseado nas informações fornecidas — consulte a folha de rescisão oficial.',
      '• Deduções de INSS e IRRF são estimativas; valores exatos dependem da situação fiscal individual.',
      '• Em caso de divergência com o empregador, procure o sindicato ou a Justiça do Trabalho.',
      '• Guarde todos os documentos de rescisão com autenticação.',
    ];
    obs.forEach(o => { addText(o, margin, y, { fontSize: 8, color: [100, 100, 100] }); y += 6; });

    // Rodapé
    const footerY = pdf.internal.pageSize.getHeight() - 14;
    addLine(footerY, 200, 200, 200);
    addText(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, margin, footerY + 8, { fontSize: 7, color: [150, 150, 150] });
    addText('rescisaonline.com.br', pageWidth - margin, footerY + 8, { fontSize: 7, align: 'right', color: [34, 197, 94] });

    const nomeArquivo = formData.nome?.trim()
      ? `rescisao-${formData.nome.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`
      : `rescisao-trabalhista-${new Date().toISOString().split('T')[0]}.pdf`;

    pdf.save(nomeArquivo);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw new Error('Não foi possível gerar o PDF. Tente novamente.');
  }
};

export const generateTextFile = ({ formData, result }: PDFExportData): void => {
  const motivo = formData.motivoRescisao ? formatMotivoRescisao(formData.motivoRescisao) : 'Não informado';
  const salarioTotal = formData.salarioMensal + (formData.comissoes ?? 0) + (formData.adicionaisHabituais ?? 0);

  let content = `CALCULADORA DE RESCISÃO TRABALHISTA
=====================================

DADOS DO FUNCIONÁRIO:`;

  if (formData.nome?.trim()) content += `\nNome: ${formData.nome}`;

  content += `
Tipo de Contrato: ${formData.tipoContrato === 'normal' ? 'Normal' : 'Experiência'}
Salário Mensal: ${formatCurrency(formData.salarioMensal)}`;

  if ((formData.comissoes ?? 0) > 0) content += `\nComissões: ${formatCurrency(formData.comissoes!)}`;
  if ((formData.adicionaisHabituais ?? 0) > 0) content += `\nAdicionais: ${formatCurrency(formData.adicionaisHabituais!)}`;
  if (salarioTotal !== formData.salarioMensal) content += `\nSalário Total Base: ${formatCurrency(salarioTotal)}`;

  content += `
Data de Admissão: ${formatDate(formData.dataAdmissao)}
Data de Demissão: ${formatDate(formData.dataDemissao)}`;

  if (formData.tipoContrato === 'experiencia') {
    content += `\nDias Trabalhados: ${formData.tempoContrato} dias`;
  } else {
    content += `\nMotivo da Rescisão: ${motivo}`;
    content += `\nAviso Prévio: ${formData.avisoPrevio === 'indenizado' ? 'Indenizado' : formData.avisoPrevio === 'trabalhado' ? 'Trabalhado' : 'Não Aplicável'}`;
  }

  content += `\nFGTS: ${formData.temFGTS ? 'Sim' : 'Não'}`;

  content += `

VERBAS RESCISÓRIAS (BRUTO):
Saldo de Salário: ${formatCurrency(result.saldoSalario)}
Férias Proporcionais + 1/3: ${formatCurrency(result.feriasPROPorcionais)}
13° Proporcional: ${formatCurrency(result.decimoTerceiroProporcional)}
FGTS + Multa: ${formatCurrency(result.fgtsMulta)}`;

  if (result.avisoPrevioIndenizado > 0) content += `\nAviso Prévio Indenizado: ${formatCurrency(result.avisoPrevioIndenizado)}`;
  if (result.indenizacaoExperiencia > 0) content += `\nIndenização Experiência: ${formatCurrency(result.indenizacaoExperiencia)}`;

  content += `\n\nTOTAL BRUTO: ${formatCurrency(result.total)}`;

  if (result.deducaoINSS > 0 || result.deducaoIRRF > 0) {
    content += `\n\nDEDUÇÕES ESTIMADAS:`;
    if (result.deducaoINSS > 0) content += `\nINSS: - ${formatCurrency(result.deducaoINSS)}`;
    if (result.deducaoIRRF > 0) content += `\nIRRF: - ${formatCurrency(result.deducaoIRRF)}`;
    content += `\nESTIMATIVA LÍQUIDA: ${formatCurrency(result.totalLiquido)}`;
  }

  if (result.seguroDesemprego.temDireito) {
    content += `\n\nSEGURO DESEMPREGO:
Parcelas: ${result.seguroDesemprego.numeroParcelas}
Valor estimado por parcela: ${formatCurrency(result.seguroDesemprego.valorEstimadoParcela)}
Total estimado: ${formatCurrency(result.seguroDesemprego.totalEstimado)}`;
  } else {
    content += `\n\nSeguro Desemprego: ${result.seguroDesemprego.motivoNaoDireito ?? 'Não há direito'}`;
  }

  if (result.prazoLimitePagamento) {
    content += `\n\nPRAZO LIMITE DE PAGAMENTO: ${formatDate(result.prazoLimitePagamento)} (Art. 477 §6° CLT)`;
  }

  content += `\n\nGerado em: ${new Date().toLocaleString('pt-BR')}
Rescisão Online - www.rescisaonline.com.br`;

  const element = document.createElement('a');
  const file = new Blob([content.trim()], { type: 'text/plain;charset=utf-8' });
  element.href = URL.createObjectURL(file);
  element.download = formData.nome?.trim()
    ? `rescisao-${formData.nome.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`
    : `rescisao-trabalhista-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const generateWhatsAppMessage = ({ formData, result }: PDFExportData): string => {
  let msg = `🧾 *CÁLCULO DE RESCISÃO TRABALHISTA*\n\n`;
  msg += `📊 *DADOS:*\n`;
  if (formData.nome?.trim()) msg += `👤 ${formData.nome}\n`;
  msg += `💰 Salário: ${formatCurrency(formData.salarioMensal)}\n`;
  msg += `📅 Admissão: ${formatDate(formData.dataAdmissao)}\n`;
  msg += `📅 Demissão: ${formatDate(formData.dataDemissao)}\n`;
  if (formData.tipoContrato === 'experiencia') {
    msg += `⏰ Dias trabalhados: ${formData.tempoContrato}\n`;
  } else {
    msg += `❓ Motivo: ${formData.motivoRescisao ? formatMotivoRescisao(formData.motivoRescisao) : 'Não informado'}\n`;
  }

  msg += `\n💰 *VALORES A RECEBER:*\n`;
  msg += `• Saldo de Salário: ${formatCurrency(result.saldoSalario)}\n`;
  msg += `• Férias + 1/3: ${formatCurrency(result.feriasPROPorcionais)}\n`;
  msg += `• 13° Proporcional: ${formatCurrency(result.decimoTerceiroProporcional)}\n`;
  msg += `• FGTS + Multa: ${formatCurrency(result.fgtsMulta)}\n`;
  if (result.avisoPrevioIndenizado > 0) msg += `• Aviso Prévio: ${formatCurrency(result.avisoPrevioIndenizado)}\n`;

  msg += `\n🎯 *TOTAL BRUTO: ${formatCurrency(result.total)}*\n`;

  if (result.totalLiquido > 0 && result.totalLiquido !== result.total) {
    msg += `💵 *Estimativa Líquida: ${formatCurrency(result.totalLiquido)}*\n`;
  }

  if (result.seguroDesemprego.temDireito) {
    msg += `\n📋 Seguro Desemprego: ${result.seguroDesemprego.numeroParcelas}x ${formatCurrency(result.seguroDesemprego.valorEstimadoParcela)}\n`;
  }

  msg += `\n_${new Date().toLocaleString('pt-BR')}_\n`;
  msg += `👉 https://www.rescisaonline.com.br`;
  return msg;
};

export const generateCopyText = ({ formData, result }: PDFExportData): string =>
  generateWhatsAppMessage({ formData, result });
