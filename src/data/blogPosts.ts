import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Blog - Rescisão Online',
  description: 'Artigos e Dicas sobre Rescisão Trabalhista',
  keywords: 'blog, artigos, dicas, rescisão trabalhista, direitos trabalhistas',
  authors: [{ name: 'Equipe Rescisão Online' }],
  openGraph: {
    title: 'Blog - Rescisão Online',
    description: 'Artigos e Dicas sobre Rescisão Trabalhista',
    url: 'https://rescisaonline.com.br/blog',
    siteName: 'Rescisão Online',
    locale: 'pt_BR',
    type: 'website',
  },
};

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  author: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 'mudancas-clt-2025',
    title: 'Mudanças na CLT em 2025',
    description: 'Confira as principais alterações na Consolidação das Leis do Trabalho que entraram em vigor este ano.',
    content: `
# Mudanças na CLT em 2025: O que Você Precisa Saber

A Consolidação das Leis do Trabalho (CLT) passou por importantes atualizações em 2025, trazendo mudanças significativas para empregadores e trabalhadores. Neste artigo, vamos abordar as principais alterações que você precisa conhecer.

## Principais Mudanças

### 1. Atualização dos Valores de Rescisão
Os cálculos de rescisão trabalhista foram atualizados com novos parâmetros, incluindo:
- Reajuste dos valores mínimos para indenizações
- Novos critérios para cálculo de férias proporcionais
- Atualização das alíquotas do FGTS

### 2. Modalidades de Trabalho
Foram regulamentadas novas modalidades de trabalho:
- Trabalho híbrido com regras específicas
- Home office com direitos garantidos
- Jornada flexível para determinadas categorias

### 3. Direitos Digitais
A legislação agora contempla:
- Direito à desconexão digital
- Proteção de dados do trabalhador
- Regulamentação do trabalho em plataformas digitais

## Impactos na Rescisão

### Cálculo Atualizado
As mudanças impactam diretamente no cálculo da rescisão:
- Saldo de Salário: Mantém a proporção por dias trabalhados
- Férias Proporcionais: Novo critério para período aquisitivo
- 13º Salário: Cálculo proporcional sem alterações
- FGTS: Mantém 8% + 40% de multa rescisória

### Prazos para Pagamento
Os prazos para pagamento da rescisão foram mantidos:
- Aviso prévio trabalhado: Até o primeiro dia útil após o término
- Aviso prévio indenizado: Até o 10º dia após a demissão

## Documentação Necessária

Para garantir todos os direitos, é fundamental manter:
- Carteira de trabalho atualizada
- Contratos e aditivos contratuais
- Comprovantes de pagamento
- Exames médicos ocupacionais

## Recomendações

- Mantenha-se atualizado sobre as mudanças na legislação
- Consulte um advogado trabalhista quando necessário
- Use nossa calculadora para estimar os valores de rescisão
- Guarde toda documentação trabalhista organizada

## Conclusão

As mudanças na CLT de 2025 trouxeram maior clareza para os direitos trabalhistas, especialmente em relação às novas modalidades de trabalho. É essencial que tanto empregadores quanto trabalhadores se mantenham informados sobre essas alterações.

Para calcular sua rescisão com base nas novas regras, utilize nossa calculadora gratuita e sempre busque orientação jurídica especializada quando necessário.
    `,
    date: '2025-01-15',
    readTime: '5 min',
    category: 'Legislação',
    tags: ['CLT', 'Rescisão', '2025', 'Direitos Trabalhistas'],
    author: 'Equipe Rescisão Online'
  },
  {
    id: 'calcular-ferias-proporcionais',
    title: 'Como Calcular Férias Proporcionais',
    description: 'Guia completo sobre o cálculo de férias proporcionais e o adicional de 1/3 constitucional.',
    content: `
# Como Calcular Férias Proporcionais: Guia Completo

As férias proporcionais são um dos direitos mais importantes do trabalhador na rescisão do contrato. Entenda como calcular corretamente esse valor.

## O que são Férias Proporcionais?

Férias proporcionais são o valor correspondente ao período de férias que o trabalhador adquiriu, mas ainda não gozou, no momento da rescisão do contrato.

## Fórmula de Cálculo

### Cálculo Base
\`\`\`
Férias Proporcionais = (Salário ÷ 12) × Meses Trabalhados
\`\`\`

### Adicional de 1/3
\`\`\`
Adicional = Férias Proporcionais ÷ 3
\`\`\`

### Valor Total
\`\`\`
Total = Férias Proporcionais + Adicional de 1/3
\`\`\`

## Exemplo Prático

Dados:
- Salário: R$ 3.000,00
- Período trabalhado: 8 meses

Cálculo:
- Férias proporcionais: (3.000 ÷ 12) × 8 = R$ 2.000,00
- Adicional 1/3: 2.000 ÷ 3 = R$ 666,67
- Total: R$ 2.666,67

## Regras Importantes

### Período Aquisitivo
- Direito às férias: 12 meses de trabalho
- Cálculo proporcional: A partir do primeiro mês
- Frações de 15 dias ou mais: Conta como mês completo

### Casos Especiais
- Demissão por justa causa: Perde direito se período < 12 meses
- Pedido de demissão: Mantém direito às proporcionais
- Acordo mútuo: Férias proporcionais + 1/3

## Documentação

Para comprovar o direito às férias proporcionais:
- Carteira de trabalho
- Controle de ponto
- Recibos de pagamento
- Ficha de registro do empregado

## Dicas Importantes

- Sempre calcule o período exato trabalhado
- Considere faltas não justificadas (podem reduzir o direito)
- Verifique convenção coletiva da categoria
- Use nossa calculadora para verificar os valores

## Quando Não Há Direito

O trabalhador perde o direito às férias proporcionais quando:
- Demitido por justa causa com menos de 12 meses
- Mais de 32 faltas injustificadas no período aquisitivo

## Conclusão

O cálculo correto das férias proporcionais é fundamental para garantir que o trabalhador receba todos os valores devidos na rescisão. Sempre que houver dúvidas, consulte um profissional especializado.

Utilize nossa calculadora online para fazer uma estimativa rápida e precisa dos seus valores de rescisão!
    `,
    date: '2025-01-10',
    readTime: '7 min',
    category: 'Cálculos',
    tags: ['Férias', 'Cálculo', 'Direitos', 'Rescisão'],
    author: 'Equipe Rescisão Online'
  },
  {
    id: 'fgts-saque-multa',
    title: 'FGTS: Saque e Multa Rescisória',
    description: 'Entenda seus direitos sobre o FGTS e quando você pode sacar o valor integral.',
    content: `
# FGTS: Saque e Multa Rescisória - Guia Completo

O Fundo de Garantia do Tempo de Serviço (FGTS) é um dos direitos mais importantes do trabalhador. Entenda como funciona o saque e a multa rescisória.

## O que é o FGTS?

O FGTS é um fundo constituído por depósitos mensais feitos pelo empregador, equivalentes a 8% do salário bruto do trabalhador.

## Quando Posso Sacar?

### Situações que Permitem Saque Total:
- Demissão sem justa causa
- Rescisão por acordo mútuo (50% do valor)
- Aposentadoria
- Compra da casa própria
- Doenças graves

### Saque-Aniversário
- Disponível anualmente no mês de aniversário
- Percentual varia conforme saldo da conta
- Não impede outros saques em situações previstas

## Multa Rescisória

### Quando Há Direito à Multa:
- Demissão sem justa causa: 40% sobre o saldo
- Rescisão por acordo: 20% sobre o saldo
- Demissão por justa causa: Sem direito à multa

### Cálculo da Multa:
\`\`\`
Multa = Saldo do FGTS × 40%
\`\`\`

## Exemplo Prático

Trabalhador com:
- 2 anos de trabalho
- Salário: R$ 2.500,00
- Demissão sem justa causa

Cálculo:
- FGTS mensal: 2.500 × 8% = R$ 200,00
- Total depositado: 200 × 24 meses = R$ 4.800,00
- Multa 40%: 4.800 × 40% = R$ 1.920,00
- Total a receber: R$ 6.720,00

## Prazos para Saque

### Demissão sem Justa Causa:
- Prazo para liberação: Imediato após rescisão
- Validade do saque: Indefinida
- Documentos: TRCT, carteira de trabalho, documento com foto

### Acordo Mútuo:
- Valor do saque: 80% do saldo
- Multa: 20% (paga ao trabalhador)
- Prazo: Mesmo da demissão sem justa causa

## Documentos Necessários

Para sacar o FGTS você precisa de:
- TRCT (Termo de Rescisão)
- Carteira de trabalho
- Documento de identidade
- CPF
- Comprovante de residência

## Onde Sacar

### Canais Disponíveis:
- Caixa Econômica Federal (agências)
- Lotéricas credenciadas
- App FGTS (para alguns valores)
- Terminais de autoatendimento

## Dicas Importantes
- Confira sempre o extrato do FGTS
- Guarde todos os comprovantes de depósito
- Acompanhe os depósitos mensais
- Consulte regularmente seu saldo

## Cuidados e Fraudes

### Fique Atento:
- Nunca pague para sacar o FGTS
- Desconfie de promessas de saque antecipado
- Verifique sempre a autenticidade dos documentos
- Use apenas canais oficiais da Caixa

## Planejamento Financeiro

### O que Fazer com o FGTS:
- Quite dívidas com juros altos
- Invista em educação ou capacitação
- Reserve para emergências
- Considere investimentos de longo prazo

## Conclusão

O FGTS é um direito fundamental que oferece segurança financeira ao trabalhador. Conhecer as regras de saque e multa rescisória é essencial para planejar sua vida financeira.

Use nossa calculadora para estimar o valor total que você tem direito a receber em caso de demissão!
    `,
    date: '2025-01-05',
    readTime: '6 min',
    category: 'FGTS',
    tags: ['FGTS', 'Saque', 'Multa', 'Direitos'],
    author: 'Equipe Rescisão Online'
  }
];

export const getBlogPost = (id: string): BlogPost | undefined => {
  return blogPosts.find(post => post.id === id);
};

export const getRelatedPosts = (currentId: string, limit: number = 2): BlogPost[] => {
  return blogPosts
    .filter(post => post.id !== currentId)
    .slice(0, limit);
};