'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { CalculatorForm } from '@/components/Calculator/CalculatorForm';
import { ResultDisplay } from '@/components/Calculator/ResultDisplay';
import { ExportButtons } from '@/components/Calculator/ExportButtons';
import { HistoricoCalculos, salvarNoHistorico } from '@/components/Calculator/HistoricoCalculos';
import { SimuladorCenarios } from '@/components/Calculator/SimuladorCenarios';
import { LoadingCalculo } from '@/components/Calculator/LoadingCalculo';
import { CalculatorFormData, CalculationResult } from '@/types/calculator';
import { calculateRescisao } from '@/utils/calculations';
import { Button } from '@/components/ui/Button';
import { GoogleAd } from '@/components/GoogleAd';
import { JsonLd } from '@/components/JsonLd';
import { blogPosts } from '@/data/blogPosts';
import { faqItems } from '@/data/faq';
import { RotateCcw, BarChart3, Sparkles, AlertTriangle, Check, ChevronDown } from 'lucide-react';

const BASE_URL = 'https://www.rescisaonline.com.br';

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Calculadora de Rescisão Online',
  url: BASE_URL,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  inLanguage: 'pt-BR',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' },
  description:
    'Calculadora gratuita de rescisão trabalhista com tabelas de INSS e IRRF de 2026, Lei 15.270/2025, FGTS, aviso prévio e seguro-desemprego.',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.pergunta,
    acceptedAnswer: { '@type': 'Answer', text: item.resposta },
  })),
};

const MESES_ABREV = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const formatarDataBlog = (iso: string) => {
  const [ano, mes, dia] = iso.split('-').map(Number);
  return `${String(dia).padStart(2, '0')} ${MESES_ABREV[mes - 1]} ${ano}`;
};
// 3 artigos mais recentes, direto dos dados — não desatualiza nem gera link quebrado
const artigosRecentes = [...blogPosts]
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, 3);

export default function HomePage() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [formData, setFormData] = useState<CalculatorFormData | null>(null);
  const [calculando, setCalculando] = useState(false);
  const [dadosCalculo, setDadosCalculo] = useState<CalculatorFormData | null>(null);
  const [modoRapido, setModoRapido] = useState(false);
  const [erroCalculo, setErroCalculo] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Submeter só guarda os dados e dispara a tela de cálculo; o resultado aparece quando ela termina
  const handleCalculate = (data: CalculatorFormData) => {
    setErroCalculo(null);
    setDadosCalculo(data);
    setCalculando(true);
  };

  // Chamado pela LoadingCalculo ao concluir a animação de passos
  const finalizarCalculo = () => {
    const data = dadosCalculo;
    setCalculando(false);
    if (!data) return;

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
      // Não apaga o resultado anterior: o usuário corrige um campo e tenta de novo sem perder o que já viu
      setErroCalculo('Não conseguimos calcular com esses dados. Confira as datas de admissão e demissão e o salário informado e tente novamente.');
    }
  };

  const toggleModo = (
    <div className="mt-3 text-center">
      <button
        type="button"
        onClick={() => setModoRapido((v) => !v)}
        className="text-xs text-gray-400 hover:text-primary-400 transition-colors underline underline-offset-2"
      >
        {modoRapido ? 'Voltar ao passo a passo' : 'Preencher tudo de uma vez (modo rápido)'}
      </button>
    </div>
  );

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

  const anoAtual = new Date().getFullYear();

  return (
    <div className="grid-canvas min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <JsonLd data={softwareSchema} />
      <JsonLd data={faqSchema} />
      {/* Hero */}
      <section id="home" className="hero-bg">
        <div className="container mx-auto px-4 pt-10 pb-12 lg:pt-16 lg:pb-16 max-w-6xl">
        {!result ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            {/* Copy */}
            <div className="lg:sticky lg:top-24 animate-fade-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-400 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                Tabelas oficiais {anoAtual} — Lei 15.270/2025 e Portaria MPS/MF 13/2026
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold text-white leading-[1.1] tracking-tight mb-5">
                Saiba exatamente{' '}
                <span className="text-gradient-primary">quanto você vai receber</span>{' '}
                na rescisão
              </h1>

              <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-lg">
                FGTS + multa, férias, 13º, aviso prévio, INSS, IRRF e seguro desemprego — calculados em segundos, sem cadastro.
              </p>

              <ul className="space-y-3 mb-10">
                {[
                  'Simulador compara todos os tipos de rescisão lado a lado',
                  `Deduções de INSS e IRRF com as tabelas vigentes de ${anoAtual}`,
                  'Projeção do aviso prévio, férias vencidas e saldo real do FGTS',
                  'Exporte em PDF profissional ou envie por WhatsApp',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-300 text-sm">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-500/15 border border-primary-500/30 flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2 max-w-md">
                {[
                  `Tabelas INSS e IRRF de ${anoAtual}`,
                  'Grátis, sem cadastro',
                  'Cálculo feito no seu navegador',
                ].map((label) => (
                  <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-800/60 border border-gray-700/60 text-xs text-gray-300">
                    <Check className="w-3.5 h-3.5 text-primary-400" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Form */}
            <div id="calculator-form" className="animate-fade-up animate-delay-200">
              {erroCalculo && (
                <div role="alert" className="mb-4 p-4 bg-red-900/30 border border-red-700/50 rounded-lg flex items-start gap-3 animate-fade-in">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300 leading-relaxed">{erroCalculo}</p>
                </div>
              )}
              <div className="form-glow">
                {calculando ? (
                  <LoadingCalculo onDone={finalizarCalculo} />
                ) : (
                  <CalculatorForm
                    onSubmit={handleCalculate}
                    initialData={formData ?? undefined}
                    modo={modoRapido ? 'single' : 'wizard'}
                  />
                )}
              </div>
              {!calculando && toggleModo}
              <HistoricoCalculos onRestore={handleRestore} />
            </div>
          </div>
        ) : (
          <>
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Calculadora de Rescisão <span className="text-gradient-primary">Trabalhista</span>
            </h1>
            <button
              onClick={handleNewCalculation}
              className="inline-flex items-center gap-2 px-6 py-3 mt-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-all duration-200 font-medium"
            >
              <RotateCcw className="w-4 h-4" /> Nova Simulação
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div id="calculator-form" className="order-1">
              {erroCalculo && (
                <div role="alert" className="mb-4 p-4 bg-red-900/30 border border-red-700/50 rounded-lg flex items-start gap-3 animate-fade-in">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300 leading-relaxed">{erroCalculo}</p>
                </div>
              )}
              {calculando ? (
                <LoadingCalculo onDone={finalizarCalculo} />
              ) : (
                <CalculatorForm
                  onSubmit={handleCalculate}
                  initialData={formData ?? undefined}
                  modo={modoRapido ? 'single' : 'wizard'}
                />
              )}
              {!calculando && toggleModo}
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
                <>
                  <ExportButtons formData={formData} result={result} />
                  <GoogleAd slot="resultadoTopo" format="rectangle" />
                </>
              )}
            </div>
          </div>
          </>
        )}
        </div>
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
              <div key={n} className="card-lift bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-primary-500/60">
                <div className="w-12 h-12 bg-primary-500/15 border border-primary-500/30 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-primary-400 font-bold text-xl">{n}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-gray-300 text-sm">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-gray-800 border border-gray-700 rounded-xl p-6 sm:p-8">
            <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary-400" /> Cada verba, com a base legal
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2.5 text-gray-300 text-sm">
              {[
                ['Saldo de Salário', 'Proporcional aos dias do último mês'],
                ['Férias + 1/3', 'Isentas de IRRF na rescisão'],
                ['13° Proporcional', '1/12 por mês trabalhado no ano'],
                ['FGTS + Multa (40/20%)', 'Sobre o saldo real informado'],
                ['Aviso Prévio', '30 + 3 dias por ano (Lei 12.506/2011)'],
                ['INSS estimado', `Tabela progressiva ${anoAtual}`],
                ['IRRF + Lei 15.270', 'IR zerado até R$ 5.000/mês'],
                ['Seguro Desemprego', 'Parcelas e valor estimado'],
                ['Prazo de pagamento', 'Alerta de vencimento (Art. 477 CLT)'],
              ].map(([label, desc]) => (
                <li key={label} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white font-medium">{label}:</strong> {desc}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-6 border-t border-gray-700/60">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Só aqui você também encontra</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 text-gray-300 text-sm">
                {[
                  'Memória de cálculo com a fórmula e a lei de cada verba',
                  'Checklist de documentos a exigir do empregador',
                  'Alerta de estabilidade (gestante, CIPA, acidentado, sindical)',
                  'Histórico dos seus cálculos salvo no navegador',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 bg-yellow-900/20 border border-yellow-800/50 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
              <div>
                <h4 className="text-lg font-semibold text-yellow-400 mb-2">Informações Importantes</h4>
                <div className="text-amber-100 space-y-1.5 text-sm">
                  <p>• <strong>Cálculos estimativos:</strong> Baseados na legislação vigente. Valores exatos constam na folha de rescisão emitida pelo empregador.</p>
                  <p>• <strong>INSS e IRRF:</strong> Calculados sobre verbas tributáveis com as tabelas vigentes de {new Date().getFullYear()}, incluindo a isenção da Lei 15.270/2025. Valores podem diferir conforme situação fiscal específica.</p>
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

      {/* FAQ */}
      <section id="faq" className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Perguntas Frequentes</h2>
            <p className="text-gray-300 text-lg">Tudo que o trabalhador costuma perguntar sobre a rescisão</p>
          </div>

          <div className="space-y-3">
            {faqItems.map((item) => (
              <details
                key={item.pergunta}
                className="group bg-gray-800 border border-gray-700 rounded-xl overflow-hidden [&_svg]:open:rotate-180"
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 py-4 text-white font-medium hover:bg-gray-800/60 transition-colors">
                  {item.pergunta}
                  <ChevronDown className="w-5 h-5 text-primary-400 flex-shrink-0 transition-transform" />
                </summary>
                <div className="px-5 pb-4 text-sm text-gray-300 leading-relaxed">
                  {item.resposta}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section id="blog" className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Artigos Recentes</h2>
            <p className="text-gray-300 text-lg">Fique por dentro das mudanças na legislação trabalhista</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artigosRecentes.map((article) => (
              <Link key={article.id} href={`/blog/${article.id}`}>
                <article className="card-lift bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-primary-500/60 cursor-pointer group h-full flex flex-col">
                  <div className="text-sm text-primary-400 mb-2">{formatarDataBlog(article.date)}</div>
                  <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-primary-400 transition-colors">{article.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4 flex-1">{article.description}</p>
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
