'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Download, Share2, Copy, FileText, Lightbulb } from 'lucide-react';
import { CalculatorFormData, CalculationResult } from '@/types/calculator';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { generatePDF, generateTextFile } from '@/utils/pdfExport';

interface ExportButtonsProps {
  formData: CalculatorFormData | null;
  result: CalculationResult | null;
}

export const ExportButtons = ({ formData, result }: ExportButtonsProps) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ tipo: 'ok' | 'erro'; msg: string } | null>(null);

  const mostrarFeedback = (tipo: 'ok' | 'erro', msg: string) => {
    setFeedback({ tipo, msg });
    setTimeout(() => setFeedback(null), 4000);
  };

  if (!formData || !result) return null;

const generateWhatsAppText = () => {
  return `*🧾 CÁLCULO DE RESCISÃO TRABALHISTA*

*📊 DADOS:*
💰 Salário: ${formatCurrency(formData.salarioMensal)}
📅 Admissão: ${formatDate(formData.dataAdmissao)}
📅 Demissão: ${formatDate(formData.dataDemissao)}
⏰ Aviso Prévio: ${
    formData.avisoPrevio === "indenizado"
      ? "Indenizado"
      : formData.avisoPrevio === "trabalhado"
      ? "Trabalhado"
      : "Não Aplicável"
  }

*💰 VALORES A RECEBER:*
• Saldo de Salário: ${formatCurrency(result.saldoSalario)}
${result.feriasVencidas > 0 ? `• Férias Vencidas + 1/3: ${formatCurrency(result.feriasVencidas)}\n` : ''}• Férias Proporcionais: ${formatCurrency(result.feriasPROPorcionais)}
• 13º Proporcional: ${formatCurrency(result.decimoTerceiroProporcional)}
• FGTS + Multa: ${formatCurrency(result.fgtsMulta)}

*🎯 TOTAL: ${formatCurrency(result.total)}*

_Calculado em: ${new Date().toLocaleString("pt-BR")}_
_Rescisão ${new Date().getFullYear()} - Calculadora Trabalhista_

👉 Acesse: https://www.rescisaonline.com.br`;
};

  const handleExportPDF = async () => {
    setLoading('pdf');
    try {
      await generatePDF({ formData, result });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      mostrarFeedback('erro', 'Não foi possível gerar o PDF — baixamos o resultado em TXT no lugar.');
      generateTextFile({ formData, result });
    } finally {
      setLoading(null);
    }
  };

  const handleExportText = () => {
    setLoading('text');
    try {
      generateTextFile({ formData, result });
    } catch (error) {
      console.error('Erro ao gerar arquivo:', error);
      mostrarFeedback('erro', 'Não foi possível gerar o arquivo. Tente "Copiar Texto".');
    } finally {
      setLoading(null);
    }
  };

  const handleShareWhatsApp = () => {
    setLoading('whatsapp');
    try {
      const text = encodeURIComponent(generateWhatsAppText());
      const url = `https://wa.me/?text=${text}`;
      window.open(url, '_blank');
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      mostrarFeedback('erro', 'Não foi possível abrir o WhatsApp. Use "Copiar Texto" e cole na conversa.');
    } finally {
      setLoading(null);
    }
  };

  const handleCopy = async () => {
    setLoading('copy');
    try {
      await navigator.clipboard.writeText(generateWhatsAppText());
      mostrarFeedback('ok', 'Cálculo copiado para a área de transferência.');
    } catch (err) {
      console.error('Erro ao copiar:', err);
      // Fallback para dispositivos que não suportam clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = generateWhatsAppText();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      mostrarFeedback('ok', 'Cálculo copiado.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4 mt-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-white mb-3">Exportar Resultado</h3>
      
      {/* Botões principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          variant="primary"
          onClick={handleExportPDF}
          loading={loading === 'pdf'}
          className="flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          {loading === 'pdf' ? 'Gerando...' : 'Baixar PDF'}
        </Button>
        
        <Button
          variant="secondary"
          onClick={handleShareWhatsApp}
          loading={loading === 'whatsapp'}
          className="flex items-center justify-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          {loading === 'whatsapp' ? 'Abrindo...' : 'WhatsApp'}
        </Button>
      </div>

      {/* Botões secundários */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={handleExportText}
          loading={loading === 'text'}
          className="flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" />
          {loading === 'text' ? 'Gerando...' : 'Baixar TXT'}
        </Button>
        
        <Button
          variant="outline"
          onClick={handleCopy}
          loading={loading === 'copy'}
          className="flex items-center justify-center gap-2"
        >
          <Copy className="w-4 h-4" />
          {loading === 'copy' ? 'Copiando...' : 'Copiar Texto'}
        </Button>
      </div>

      {/* Feedback de exportação */}
      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className={`text-sm p-3 rounded-lg border animate-fade-in ${
            feedback.tipo === 'ok'
              ? 'bg-emerald-900/20 border-emerald-700/40 text-emerald-300'
              : 'bg-red-900/30 border-red-700/50 text-red-300'
          }`}
        >
          {feedback.msg}
        </div>
      )}

      {/* Info adicional */}
      <div className="flex items-start gap-2 text-xs text-gray-400 mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
        <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0" />
        <span><strong>Dica:</strong> O PDF funciona melhor no desktop. No mobile, use "Baixar TXT" ou "Copiar Texto".</span>
      </div>
    </div>
  );
};