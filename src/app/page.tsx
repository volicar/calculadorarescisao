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
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const calculationResult = calculateRescisao(data);
      setResult(calculationResult);
      setFormData(data);
    } catch (error) {
      console.error('Erro no cálculo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <section id="home" className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Calculadora de Rescisão
            <span className="block text-primary-400">Trabalhista 2025</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Calcule de forma rápida e precisa todos os valores da sua rescisão trabalhista. 
            Gratuito, confiável e atualizado com a legislação vigente.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <div className="order-1">
            <CalculatorForm onSubmit={handleCalculate} loading={loading} />
          </div>
          
          {/* Results */}
          <div className="order-2">
            <ResultDisplay result={result} />
            {result && formData && (
              <ExportButtons formData={formData} result={result} />
            )}
          </div>
        </div>
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
              para calcular todos os valores que você tem direito a receber.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-primary-500 transition-colors">
              <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Preencha os Dados</h3>
              <p className="text-gray-300">
                Informe seu salário mensal, datas de admissão e demissão, e tipo de aviso prévio.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-primary-500 transition-colors">
              <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Cálculo Automático</h3>
              <p className="text-gray-300">
                Nossa ferramenta calcula automaticamente todos os valores: saldo, férias, 13º e FGTS.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-primary-500 transition-colors">
              <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Exporte o Resultado</h3>
              <p className="text-gray-300">
                Baixe em PDF, compartilhe no WhatsApp ou copie para usar onde precisar.
              </p>
            </div>
          </div>

          {/* Detalhes dos Cálculos */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">📊 Valores Calculados</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-primary-400 mr-2">•</span>
                  <span><strong>Saldo de Salário:</strong> Proporcional aos dias trabalhados no mês</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-400 mr-2">•</span>
                  <span><strong>Férias Proporcionais:</strong> 1/12 por mês + 1/3 constitucional</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-400 mr-2">•</span>
                  <span><strong>13º Proporcional:</strong> 1/12 do salário por mês trabalhado</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-400 mr-2">•</span>
                  <span><strong>FGTS + Multa:</strong> 8% depositado + 40% de multa rescisória</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">⚠️ Informações Importantes</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span>Cálculos baseados na legislação trabalhista vigente em 2025</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span>Valores aproximados para orientação geral</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span>Sempre consulte um advogado trabalhista qualificado</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span>Mantenha toda documentação trabalhista organizada</span>
                </li>
              </ul>
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
                id: 'fgts-saque-multa',
                title: "FGTS: Saque e Multa Rescisória",
                description: "Entenda seus direitos sobre o FGTS e quando você pode sacar o valor integral.",
                date: "05 Jan 2025"
              }
            ].map((article, index) => (
              <Link key={index} href={`/blog/${article.id}`}>
                <article className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-primary-500 transition-all duration-300 cursor-pointer group h-full">
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

          {/* Ver Todos os Artigos */}
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