'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { CalculatorForm } from '@/components/Calculator/CalculatorForm';
import { ResultDisplay } from '@/components/Calculator/ResultDisplay';
import { ExportButtons } from '@/components/Calculator/ExportButtons';
import { HistoricoCalculos, salvarNoHistorico } from '@/components/Calculator/HistoricoCalculos';
import { SimuladorCenarios } from '@/components/Calculator/SimuladorCenarios';
import { CalculatorFormData, CalculationResult } from '@/types/calculator';
import { calculateRescisao } from '@/utils/calculations';
import { Button } from '@/components/ui/Button';
import { GoogleAd } from '@/components/GoogleAd';

export default function HomePage() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [formData, setFormData] = useState<CalculatorFormData | null>(null);
  const [loading, setLoading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleCalculate = async (data: CalculatorFormData) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
      const calculationResult = calculateRescisao(data);
      setResult(calculationResult);
      setFormData(data);

      salvarNoHistorico(data, calculationResult);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (error) {
      console.error('Erro no cálculo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = (fd: CalculatorFormData, r: CalculationResult) => {
    setFormData(fd);
    setResult(r);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleNewCalculation = () => {
    setResult(null);
    setFormData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero */}
      <section id="home" className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Calculadora de Rescisão
            <span className="block text-primary-400">Trabalhista</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Calcule suas verbas rescisórias, deduções de INSS e IRRF, seguro desemprego e prazo de pagamento. Gratuito e atualizado com a legislação vigente.
          </p>
        </div>

        {result && (
          <div className="text-center mb-6">
            <button
              onClick={handleNewCalculation}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-all duration-200 font-medium"
            >
              <span>📝</span> Nova Simulação
            </button>
          </div>
        )}

        {!result ? (
          <div id="calculator-form" className="flex justify-center">
            <div className="w-full max-w-xl">
              <CalculatorForm onSubmit={handleCalculate} loading={loading} />
              <HistoricoCalculos onRestore={handleRestore} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div id="calculator-form" className="order-1">
              <CalculatorForm onSubmit={handleCalculate} loading={loading} />
              <HistoricoCalculos onRestore={handleRestore} />
              {/* Simulador de cenários */}
              {formData && <SimuladorCenarios formData={formData} />}
            </div>

            <div ref={resultRef} id="calculation-result" className="order-2 space-y-4">
              <ResultDisplay
                result={result}
                nome={formData?.nome}
                dadosOriginais={formData ? {
                  salarioMensal: formData.salarioMensal,
                  comissoes: formData.comissoes,
                  adicionaisHabituais: formData.adicionaisHabituais,
                  dataAdmissao: formData.dataAdmissao,
                  dataDemissao: formData.dataDemissao,
                  tipoContrato: formData.tipoContrato,
                  motivoRescisao: formData.motivoRescisao,
                  tempoContrato: formData.tempoContrato,
                  avisoPrevio: formData.avisoPrevio,
                  temFGTS: formData.temFGTS,
                  temEstabilidade: formData.temEstabilidade,
                  tipoEstabilidade: formData.tipoEstabilidade,
                  numeroDependentesIR: formData.numeroDependentesIR,
                } : undefined}
              />

              {result && formData && (
                <ExportButtons formData={formData} result={result} />
              )}
            </div>
          </div>
        )}
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="bg-gray-800/50 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Como Funciona?</h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Calculadora completa com verbas brutas, deduções estimadas, simulador de cenários e seguro desemprego.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { n: 1, title: 'Preencha os Dados', desc: 'Salário, datas, tipo de contrato, comissões e adicionais habituais.' },
              { n: 2, title: 'Cálculo Completo', desc: 'Verbas brutas + INSS + IRRF + FGTS com base atualizada.' },
              { n: 3, title: 'Simule Cenários', desc: 'Compare o que recebe em cada tipo de rescisão lado a lado.' },
              { n: 4, title: 'Exporte', desc: 'PDF profissional, WhatsApp, TXT ou copie para usar onde precisar.' },
            ].map(({ n, title, desc }) => (
              <div key={n} className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-primary-500 transition-colors">
                <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">{n}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-gray-300 text-sm">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">📊</span> O que é calculado
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                {[
                  ['Saldo de Salário', 'Proporcional aos dias do último mês'],
                  ['Férias + 1/3', 'Isentas de IRRF na rescisão'],
                  ['13° Proporcional', '1/12 por mês trabalhado'],
                  ['FGTS + Multa (40/20%)', 'Com base no saldo real estimado'],
                  ['Aviso Prévio', '30 + 3 dias por ano (Lei 12.506/2011)'],
                  ['INSS estimado', 'Tabela progressiva 2025'],
                  ['IRRF estimado', 'Por faixa sobre verbas tributáveis'],
                  ['Seguro Desemprego', 'Parcelas e valor estimado'],
                ].map(([label, desc]) => (
                  <li key={label} className="flex items-start gap-2">
                    <span className="text-primary-400 mt-0.5">•</span>
                    <span><strong>{label}:</strong> {desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">✨</span> Diferenciais
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                {[
                  'Simulador de cenários: compare todos os tipos de rescisão',
                  'Deduções de INSS e IRRF com base legal',
                  'Salário composto: comissões + adicionais habituais',
                  'Alerta de estabilidade provisória (gestante, CIPA, etc.)',
                  'Prazo de pagamento com alerta de vencimento',
                  'Checklist de documentos por tipo de rescisão',
                  'Histórico de cálculos salvos no navegador',
                  'Memória de cálculo com base legal detalhada',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 bg-yellow-900/20 border border-yellow-800/50 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <span className="text-yellow-400 text-2xl flex-shrink-0">⚠️</span>
              <div>
                <h4 className="text-lg font-semibold text-yellow-400 mb-2">Informações Importantes</h4>
                <div className="text-gray-300 space-y-1.5 text-sm">
                  <p>• <strong>Cálculos estimativos:</strong> Baseados na legislação vigente. Valores exatos constam na folha de rescisão emitida pelo empregador.</p>
                  <p>• <strong>INSS e IRRF:</strong> Calculados sobre verbas tributáveis com tabelas de 2025. Valores podem diferir conforme situação fiscal específica.</p>
                  <p>• <strong>Consulte um especialista:</strong> Para casos com adicional de insalubridade, horas extras, estabilidade ou acordos coletivos diferenciados.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Anúncio entre seções — homepage */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <GoogleAd slot="homepageMeio" format="horizontal" />
      </div>

      {/* Blog */}
      <section id="blog" className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Artigos Recentes</h2>
            <p className="text-gray-300 text-lg">Fique por dentro das mudanças na legislação trabalhista</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { id: 'mudancas-clt-2025', title: 'Mudanças na CLT em 2025', description: 'Confira as principais alterações na legislação trabalhista vigentes este ano.', date: '15 Jan 2025' },
              { id: 'calcular-ferias-proporcionais', title: 'Como Calcular Férias Proporcionais', description: 'Guia completo sobre o cálculo de férias proporcionais e o adicional de 1/3.', date: '10 Jan 2025' },
              { id: 'memoria-calculo-rescisao', title: 'Entenda a Memória de Cálculo', description: 'Aprenda a interpretar cada item da sua rescisão com nossa calculadora.', date: '08 Jan 2025' },
            ].map((article, index) => (
              <Link key={index} href={`/blog/${article.id}`}>
                <article className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-primary-500 transition-colors duration-300 cursor-pointer group h-full">
                  <div className="text-sm text-primary-400 mb-2">{article.date}</div>
                  <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-primary-400 transition-colors">{article.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">{article.description}</p>
                  <div className="text-primary-400 text-sm font-medium group-hover:text-primary-300 transition-colors">Ler mais →</div>
                </article>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/blog">
              <Button variant="outline" size="lg">Ver Todos os Artigos</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
