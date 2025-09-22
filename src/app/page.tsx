'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CalculatorForm } from '@/components/Calculator/CalculatorForm';
import { ResultDisplay } from '@/components/Calculator/ResultDisplay';
import { ExportButtons } from '@/components/Calculator/ExportButtons';
import { CalculatorFormData, CalculationResult } from '@/types/calculator';
import { calculateRescisao } from '@/utils/calculations';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [formData, setFormData] = useState<CalculatorFormData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (data: CalculatorFormData) => {
    setLoading(true);

    // Simula delay de API
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const calculationResult = calculateRescisao(data);
      setResult(calculationResult);
      setFormData(data);

      // Scroll suave para o resultado após o cálculo
      setTimeout(() => {
        const resultElement = document.getElementById('calculation-result');
        if (resultElement) {
          resultElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 100);

    } catch (error) {
      console.error('Erro no cálculo:', error);
      // Aqui você pode adicionar uma notificação de erro para o usuário
    } finally {
      setLoading(false);
    }
  };

  const handleNewCalculation = () => {
    setResult(null);
    setFormData(null);
    
    // Scroll para o topo do formulário
    const formElement = document.getElementById('calculator-form');
    if (formElement) {
      formElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <section id="home" className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Calculadora de Rescisão
            <span className="block text-primary-400">Trabalhista</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Calcule de forma rápida e precisa todos os valores da sua rescisão trabalhista. 
            Gratuito, confiável e atualizado com a legislação vigente.
          </p>
        </div>

        {/* Botão Nova Simulação - aparece quando há resultado */}
        {result && (
          <div className="text-center mb-6">
            <button
              onClick={handleNewCalculation}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              <span className="text-lg">📝</span>
              Nova Simulação
            </button>
          </div>
        )}

        {/* Layout Adaptativo */}
        {!result ? (
          // Antes de calcular: formulário centralizado
          <div id="calculator-form" className="flex justify-center">
            <div className="w-full max-w-xl">
              <CalculatorForm onSubmit={handleCalculate} loading={loading} />
            </div>
          </div>
        ) : (
          // Depois de calcular: layout lado a lado em telas grandes
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulário */}
            <div id="calculator-form" className="order-1">
              <CalculatorForm onSubmit={handleCalculate} loading={loading} />
            </div>

            {/* Resultado com Memória de Cálculo */}
            <div id="calculation-result" className="order-2 space-y-4">
              <ResultDisplay 
                result={result}
                nome={formData?.nome}
                dadosOriginais={formData ? {
                  salarioMensal: formData.salarioMensal,
                  dataAdmissao: formData.dataAdmissao,
                  dataDemissao: formData.dataDemissao,
                  tipoContrato: formData.tipoContrato,
                  motivoRescisao: formData.motivoRescisao,
                  tempoContrato: formData.tempoContrato,
                  avisoPrevio: formData.avisoPrevio,
                  temFGTS: formData.temFGTS
                } : undefined}
              />
              
              {/* Botões de Export */}
              {result && formData && (
                <ExportButtons formData={formData} result={result} />
              )}
            </div>
          </div>
        )}
      </section>

      {/* Como Funciona Section */}
      <section id="como-funciona" className="bg-gray-800/50 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Como Funciona a Calculadora?
            </h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Nossa calculadora utiliza as fórmulas oficiais da legislação trabalhista brasileira 
              para calcular todos os valores que você tem direito a receber, com memória de cálculo detalhada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-primary-500 transition-colors">
              <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Preencha os Dados</h3>
              <p className="text-gray-300 text-sm">
                Informe seu salário, datas de admissão e demissão, tipo de contrato e aviso prévio.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-primary-500 transition-colors">
              <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Cálculo Automático</h3>
              <p className="text-gray-300 text-sm">
                Calculamos automaticamente saldo, férias, 13º, FGTS e aviso prévio conforme a CLT.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-primary-500 transition-colors">
              <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Memória de Cálculo</h3>
              <p className="text-gray-300 text-sm">
                Veja exatamente como cada valor foi calculado com fórmulas e explicações detalhadas.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-primary-500 transition-colors">
              <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Exporte o Resultado</h3>
              <p className="text-gray-300 text-sm">
                Baixe em PDF, compartilhe no WhatsApp ou copie para usar onde precisar.
              </p>
            </div>
          </div>

          {/* Detalhes dos Cálculos */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Valores Calculados
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-primary-400 mr-2">•</span>
                  <span><strong>Saldo de Salário:</strong> Proporcional aos dias trabalhados no último mês</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-400 mr-2">•</span>
                  <span><strong>Férias Proporcionais:</strong> 1/12 por mês trabalhado + 1/3 constitucional</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-400 mr-2">•</span>
                  <span><strong>13º Proporcional:</strong> 1/12 do salário por mês trabalhado</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-400 mr-2">•</span>
                  <span><strong>FGTS + Multa:</strong> 8% depositado + 40% de multa rescisória</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-400 mr-2">•</span>
                  <span><strong>Aviso Prévio:</strong> 30 dias + 3 dias por ano trabalhado</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🔍</span>
                Funcionalidades Exclusivas
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-emerald-400 mr-2">✓</span>
                  <span><strong>Memória de Cálculo:</strong> Veja como cada valor foi calculado</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-400 mr-2">✓</span>
                  <span><strong>Contratos de Experiência:</strong> Cálculos específicos para esse tipo</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-400 mr-2">✓</span>
                  <span><strong>Aviso Prévio Progressivo:</strong> Conforme Lei 12.506/2011</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-400 mr-2">✓</span>
                  <span><strong>Base Legal:</strong> Referencias às leis aplicadas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-400 mr-2">✓</span>
                  <span><strong>Interface Didática:</strong> Explicações claras e acessíveis</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Aviso Legal Atualizado */}
          <div className="mt-12 bg-yellow-900/20 border border-yellow-800/50 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <span className="text-yellow-400 text-2xl flex-shrink-0">⚠️</span>
              <div>
                <h4 className="text-lg font-semibold text-yellow-400 mb-2">Informações Importantes</h4>
                <div className="text-gray-300 space-y-2 text-sm">
                  <p>• <strong>Cálculos estimativos:</strong> Baseados na legislação trabalhista vigente, mas valores podem variar conforme situações específicas</p>
                  <p>• <strong>Consulte um especialista:</strong> Para casos complexos, procure sempre um advogado trabalhista qualificado</p>
                  <p>• <strong>Documentação:</strong> Mantenha toda sua documentação trabalhista organizada e atualizada</p>
                  <p>• <strong>Atualização:</strong> Legislação atualizada conforme mudanças de 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Artigos Recentes
            </h2>
            <p className="text-gray-300 text-lg">
              Fique por dentro das mudanças na legislação trabalhista
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                id: 'mudancas-clt-2025',
                title: "Mudanças na CLT em 2025",
                description: "Confira as principais alterações na Consolidação das Leis do Trabalho que entraram em vigor este ano.",
                date: "15 Jan 2025"
              },
              {
                id: 'calcular-ferias-proporcionais',
                title: "Como Calcular Férias Proporcionais",
                description: "Guia completo sobre o cálculo de férias proporcionais e o adicional de 1/3 constitucional.",
                date: "10 Jan 2025"
              },
              {
                id: 'memoria-calculo-rescisao',
                title: "Entenda a Memória de Cálculo",
                description: "Aprenda a interpretar cada item da sua rescisão trabalhista com nossa nova funcionalidade.",
                date: "08 Jan 2025"
              }
            ].map((article, index) => (
              <Link key={index} href={`/blog/${article.id}`}>
                <article className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-primary-500 transition-colors duration-300 cursor-pointer group h-full">
                  <div className="text-sm text-primary-400 mb-2">{article.date}</div>
                  <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-primary-400 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4 flex-grow">
                    {article.description}
                  </p>
                  <div className="text-primary-400 text-sm font-medium group-hover:text-primary-300 transition-colors">
                    Ler mais →
                  </div>
                </article>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/blog">
              <Button variant="outline" size="lg">
                Ver Todos os Artigos
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}