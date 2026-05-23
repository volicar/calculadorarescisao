import type { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calculator, Users, Shield, Zap, ArrowLeft, CheckCircle, BookOpen, RefreshCw, Scale, UserCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sobre - Calculadora de Rescisão Online',
  description: 'Conheça nossa missão de democratizar o acesso aos cálculos trabalhistas no Brasil. Ferramenta gratuita, confiável e sempre atualizada.',
  keywords: 'sobre calculadora rescisão, equipe, missão, direitos trabalhistas, brasil',
};

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Navegação de volta */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Calculadora
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-6">
            <div className="bg-primary-500 rounded-full p-4">
              <Calculator className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Sobre a
            <span className="block text-primary-400">Rescisão Online</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
            Criamos a Rescisão Online porque muita gente chega ao fim de um contrato sem saber ao certo o que tem direito a receber. Uma ferramenta gratuita, direta e sempre atualizada com a CLT vigente.
          </p>
        </div>

        {/* Missão, Visão e Valores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center hover:border-primary-500 transition-all duration-300">
            <div className="bg-primary-500/20 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">O que fazemos</h3>
            <p className="text-gray-300">
              Calculamos saldo de salário, férias, 13°, FGTS + multa, aviso prévio, INSS, IRRF e seguro desemprego — tudo em um lugar, sem cadastro.
            </p>
          </Card>

          <Card className="text-center hover:border-primary-500 transition-all duration-300">
            <div className="bg-blue-500/20 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Zap className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Como funciona</h3>
            <p className="text-gray-300">
              Você preenche os dados do seu contrato e a calculadora aplica as tabelas de 2025 (INSS, IRRF, Lei 12.506/2011) para gerar a estimativa instantaneamente.
            </p>
          </Card>

          <Card className="text-center hover:border-primary-500 transition-all duration-300">
            <div className="bg-yellow-500/20 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="w-8 h-8 text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Para quem é</h3>
            <p className="text-gray-300">
              Para qualquer trabalhador que queira conferir os valores antes de assinar a rescisão ou entender o que cada linha do termo significa.
            </p>
          </Card>
        </div>

        {/* Por que criamos */}
        <Card className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Por que criamos a Rescisão Online?
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Assinar uma rescisão sem conferir os números é arriscado. A maioria das pessoas não tem tempo nem conhecimento para verificar cada verba manualmente — e muitas acabam recebendo menos do que têm direito.
                </p>
                <p>
                  Criamos esta ferramenta para que qualquer pessoa possa, em dois minutos, ter uma visão clara do que está sendo pago e do que ainda pode ser cobrado.
                </p>
                <p>
                  <strong className="text-white">Sem cadastro, sem cobrança, sem coleta de dados.</strong> Os cálculos ficam no seu navegador.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-500/20 to-primary-600/20 p-8 rounded-lg">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white">100% Gratuito para sempre</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white">Cálculos baseados na CLT 2025</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white">Explicações detalhadas</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white">Atualização constante</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white">Interface simples e intuitiva</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* O que oferecemos */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            O que Nossa Calculadora Oferece
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Cálculos Completos',
                description: 'Saldo de salário, férias, 13º, FGTS e multa rescisória calculados automaticamente.'
              },
              {
                title: 'Todos os Tipos de Rescisão',
                description: 'Demissão sem justa causa, pedido, acordo mútuo, justa causa e fim de contrato.'
              },
              {
                title: 'Aviso Prévio Proporcional',
                description: '30 dias base + 3 dias por ano trabalhado, calculado automaticamente.'
              },
              {
                title: 'Memória de Cálculo',
                description: 'Veja exatamente como cada valor foi calculado, fórmula por fórmula.'
              },
              {
                title: 'Exportação em PDF',
                description: 'Baixe ou compartilhe seus cálculos em formato profissional.'
              },
              {
                title: 'Mobile Responsivo',
                description: 'Funciona perfeitamente em qualquer dispositivo, a qualquer hora.'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-primary-500 transition-colors">
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Compromisso com a precisão */}
        <Card className="mb-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-6">
              Nosso Compromisso com a Precisão
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div>
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary-400" /> Base Legal</h3>
                <p className="text-gray-300 mb-4">
                  Todos os cálculos seguem a <strong>CLT</strong>, tabelas do INSS e IRRF de 2025, Lei 12.506/2011 (aviso prévio proporcional) e Lei 7.713/88 (isenção IRRF em férias).
                </p>

                <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><RefreshCw className="w-4 h-4 text-blue-400" /> Atualização Constante</h3>
                <p className="text-gray-300">
                  Sempre que a legislação muda — salário mínimo, faixas de INSS, limites do seguro desemprego — atualizamos a ferramenta.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><Scale className="w-4 h-4 text-yellow-400" /> Estimativa, não certeza</h3>
                <p className="text-gray-300 mb-4">
                  Os valores gerados são uma <strong>estimativa fundamentada</strong>. O documento oficial é o TRCT emitido pelo empregador, que pode incluir horas extras, adicionais e acordos coletivos.
                </p>

                <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><UserCheck className="w-4 h-4 text-green-400" /> Quando consultar um advogado</h3>
                <p className="text-gray-300">
                  Nos casos de justa causa contestável, estabilidade provisória, assédio ou irregularidades no contrato, busque um <strong>advogado trabalhista</strong>.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* CTA Final */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary-500/10 to-primary-600/10 border border-primary-500/20 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Pronto para Calcular sua Rescisão?
            </h2>
            <p className="text-gray-300 mb-6">
              Descubra exatamente quanto você tem direito a receber de forma gratuita e confiável.
            </p>
            <Link href="/">
              <Button size="lg" className="bg-primary-500 hover:bg-primary-600">
                Calcular Agora
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}