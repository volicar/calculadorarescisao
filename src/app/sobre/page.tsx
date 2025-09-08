import type { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calculator, Users, Shield, Zap, ArrowLeft, CheckCircle } from 'lucide-react';

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
            Nossa missão é democratizar o acesso aos cálculos trabalhistas no Brasil, 
            oferecendo uma ferramenta gratuita, precisa e sempre atualizada para todos os trabalhadores.
          </p>
        </div>

        {/* Missão, Visão e Valores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center hover:border-primary-500 transition-all duration-300">
            <div className="bg-primary-500/20 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Nossa Missão</h3>
            <p className="text-gray-300">
              Garantir que todo trabalhador brasileiro tenha acesso fácil e gratuito 
              aos cálculos corretos de seus direitos trabalhistas.
            </p>
          </Card>

          <Card className="text-center hover:border-primary-500 transition-all duration-300">
            <div className="bg-blue-500/20 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Zap className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Nossa Visão</h3>
            <p className="text-gray-300">
              Ser a principal referência em cálculos trabalhistas online no Brasil, 
              promovendo transparência e conhecimento.
            </p>
          </Card>

          <Card className="text-center hover:border-primary-500 transition-all duration-300">
            <div className="bg-yellow-500/20 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="w-8 h-8 text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Nossos Valores</h3>
            <p className="text-gray-300">
              Transparência, precisão, acessibilidade e compromisso com os 
              direitos fundamentais dos trabalhadores brasileiros.
            </p>
          </Card>
        </div>

        {/* Por que criamos */}
        <Card className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Por que Criamos a Rescisão Online?
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Identificamos que muitos trabalhadores brasileiros não sabem exatamente 
                  quais são seus direitos na hora da rescisão do contrato de trabalho.
                </p>
                <p>
                  Calculadoras complexas, informações desencontradas e falta de clareza 
                  sobre os valores fazem com que milhares de pessoas sejam prejudicadas 
                  mensalmente.
                </p>
                <p>
                  Nossa ferramenta resolve isso oferecendo <strong className="text-white">
                  cálculos precisos, explicações detalhadas e total gratuidade</strong>, 
                  garantindo que você saiba exatamente o que tem direito a receber.
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
                <h3 className="font-semibold text-white mb-3">📚 Base Legal Sólida</h3>
                <p className="text-gray-300 mb-4">
                  Todos os cálculos são baseados na <strong>Consolidação das Leis do Trabalho (CLT)</strong> 
                  atualizada, incluindo as mudanças de 2025.
                </p>
                
                <h3 className="font-semibold text-white mb-3">🔄 Atualizações Constantes</h3>
                <p className="text-gray-300">
                  Acompanhamos mudanças na legislação trabalhista e atualizamos 
                  nossa ferramenta imediatamente.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-3">⚖️ Disclaimer Importante</h3>
                <p className="text-gray-300 mb-4">
                  Nossa calculadora oferece <strong>estimativas precisas</strong> baseadas 
                  nas informações fornecidas e na legislação vigente.
                </p>
                
                <h3 className="font-semibold text-white mb-3">👨‍💼 Recomendação</h3>
                <p className="text-gray-300">
                  Para casos complexos ou dúvidas específicas, sempre recomendamos 
                  consultar um <strong>advogado trabalhista qualificado</strong>.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Equipe 
        <Card className="mb-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-6">Nossa Equipe</h2>
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-700/30 rounded-lg p-6">
                <div className="w-20 h-20 bg-primary-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">V</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Vinicius</h3>
                <p className="text-primary-400 mb-3">Fundador & Desenvolvedor</p>
                <p className="text-gray-300 text-sm">
                  Especialista em desenvolvimento web e entusiasta dos direitos trabalhistas. 
                  Criou a Rescisão 2025 com o objetivo de democratizar o acesso aos cálculos 
                  trabalhistas no Brasil.
                </p>
              </div>
            </div>
          </div>
        </Card> */}

        {/* Contato 
        <Card className="mb-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-6">Entre em Contato</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-white mb-2">📧 Email</h3>
                <p className="text-gray-300">contato@rescisao2025.com.br</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">💬 WhatsApp</h3>
                <p className="text-gray-300">(11) 99999-9999</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">🌐 Site</h3>
                <p className="text-gray-300">www.rescisao2025.com.br</p>
              </div>
            </div>
            
            <div className="mt-8">
              <p className="text-gray-400 text-sm mb-4">
                Tem alguma sugestão ou encontrou algum problema? Entre em contato conosco!
              </p>
              <p className="text-gray-400 text-sm">
                Respondemos todos os contatos em até 24 horas úteis.
              </p>
            </div>
          </div>
        </Card> */}

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