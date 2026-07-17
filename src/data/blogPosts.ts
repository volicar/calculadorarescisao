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
    id: 'ir-rescisao-2026-lei-15270',
    title: 'Imposto de Renda na Rescisão em 2026: a Lei 15.270 muda tudo',
    description: 'A Lei 15.270/2025 isenta de IR quem ganha até R$ 5.000 por mês e reduz o imposto até R$ 7.350. Veja como isso afeta o valor líquido da sua rescisão em 2026.',
    content: `
# Imposto de Renda na Rescisão em 2026: a Lei 15.270 muda tudo

A maior novidade trabalhista e tributária de 2026 não está na CLT — está no Imposto de Renda. A **Lei 15.270/2025**, sancionada em novembro de 2025 e em vigor desde janeiro de 2026, mudou de forma direta quanto você recebe líquido na rescisão.

## O que mudou

### Isenção total até R$ 5.000
A partir de 2026, quem tem rendimento tributável mensal de **até R$ 5.000 fica isento de IRRF**. Na prática, a imensa maioria das rescisões passou a não ter desconto de Imposto de Renda sobre o saldo de salário e o 13º.

### Redução gradual até R$ 7.350
Entre R$ 5.000,01 e R$ 7.350, existe um **desconto parcial** que diminui conforme o rendimento sobe. Acima de R$ 7.350, aplica-se a tabela progressiva tradicional, sem o benefício.

### Tabelas de INSS e IRRF de 2026
Além da Lei 15.270, valem as novas tabelas do ano:
- **INSS**: Portaria Interministerial MPS/MF nº 13/2026, com faixas de 7,5% a 14% e teto de R$ 8.475,55.
- **Salário mínimo 2026**: R$ 1.621,00, que serve de piso para o seguro-desemprego.

## Como isso afeta a sua rescisão

O Imposto de Renda na rescisão incide, em regra, sobre o **saldo de salário** e o **13º proporcional** (o 13º tem tributação exclusiva, calculada em separado). Não incide sobre:
- **Férias indenizadas + 1/3** (isentas — Lei 7.713/88, art. 6º, V);
- **Aviso prévio indenizado** (natureza indenizatória, jurisprudência pacífica).

Com a isenção até R$ 5.000, quem antes via um desconto de IRRF na rescisão agora costuma receber esse valor de volta no líquido.

## Exemplo prático

Trabalhador com salário de R$ 3.000, dispensado sem justa causa:
- Saldo de salário e 13º ficam **abaixo de R$ 5.000** por mês;
- Resultado: **IRRF zero** sobre essas verbas em 2026;
- O líquido a receber sobe em relação às regras antigas.

## Como conferir o seu caso

Nossa calculadora já aplica as tabelas de 2026 e a regra da Lei 15.270 automaticamente. Basta informar salário, datas e motivo da rescisão para ver o valor **líquido** estimado, com o detalhamento de INSS e IRRF na memória de cálculo.

## Conclusão

2026 é um ano de líquido maior na mão do trabalhador por causa da Lei 15.270. Ainda assim, valores exatos dependem da folha de rescisão emitida pelo empregador — use a calculadora para se preparar e, em caso de dúvida, procure um advogado trabalhista.
    `,
    date: '2026-01-20',
    readTime: '6 min',
    category: 'Legislação',
    tags: ['Lei 15.270', 'Imposto de Renda', 'IRRF', 'Rescisão', '2026'],
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
    date: '2026-01-15',
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
    date: '2026-01-08',
    readTime: '6 min',
    category: 'FGTS',
    tags: ['FGTS', 'Saque', 'Multa', 'Direitos'],
    author: 'Equipe Rescisão Online'
  }

  , {
    id: 'principais-direitos-trabalhistas-2026',
    title: 'Principais Direitos Trabalhistas Garantidos pela CLT em 2026',
    description: 'Análise dos direitos fundamentais assegurados aos trabalhadores pela CLT e normas correlatas em 2026.',
    content: `
# Principais Direitos Trabalhistas em 2026

A Consolidação das Leis do Trabalho (CLT) e legislações complementares asseguram um conjunto de direitos mínimos ao trabalhador. Abaixo, destacamos os institutos mais relevantes:

## Jornada de Trabalho
- Art. 58 da CLT: limite de 8h diárias e 44h semanais.
- Horas extraordinárias (art. 59): mínimo de 50% de adicional.

## Férias
- Art. 129: direito a 30 dias anuais após 12 meses de vínculo.
- Art. 134: possibilidade de fracionamento em até 3 períodos, sendo um de no mínimo 14 dias.
- Pagamento acrescido de 1/3 constitucional (art. 7º, XVII, CF).

## Décimo Terceiro Salário
- Lei 4.090/1962 e 4.749/1965: pagamento em duas parcelas (novembro e dezembro).
- Proporcionalidade em caso de rescisão contratual.

## FGTS
- Lei 8.036/1990: depósitos mensais de 8% da remuneração.
- Hipóteses de saque: dispensa sem justa causa, aposentadoria, aquisição de imóvel, doenças graves etc.
- Multa de 40% em dispensa imotivada.

## Aviso Prévio
- Lei 12.506/2011: mínimo de 30 dias, acrescido de 3 dias por ano de serviço, até 90 dias.
- Pode ser trabalhado ou indenizado.

## Adicional Noturno
- Art. 73 da CLT: acréscimo de 20% para jornada entre 22h e 5h.

## Licenças
- Licença-maternidade: 120 dias (art. 392).
- Licença-paternidade: 5 dias, podendo ser estendida por programas governamentais.
- Licença médica: via benefício do INSS.

## Verbas Rescisórias
- Saldo de salário, férias vencidas e proporcionais + 1/3, 13º proporcional e FGTS.
- Multa de 40% sobre o FGTS em dispensa sem justa causa.
- Prazos: até o 10º dia após o desligamento (art. 477).

## Conclusão
O cumprimento desses direitos é obrigatório e sua inobservância pode gerar passivos trabalhistas. Recomenda-se a constante atualização das práticas de RH e a consulta a profissionais jurídicos para adequação às normas vigentes.
  `,
    date: '2026-01-25',
    readTime: '8 min',
    category: 'Direitos',
    tags: ['Direitos Trabalhistas', 'Direitos', 'CLT', 'Legislação', '2026'],
    author: 'Equipe Rescisão Online'
  },

  {
    id: 'contrato-experiencia-90-dias',
    title: 'Contrato de Experiência de 90 Dias na CLT',
    description: 'Entenda como funciona o contrato de experiência de até 90 dias segundo a Consolidação das Leis do Trabalho, incluindo regras de cálculo.',
    content: `
# Contrato de Experiência de 90 Dias

O contrato de experiência é uma modalidade prevista na Consolidação das Leis do Trabalho (CLT), utilizada para que empregador e empregado possam avaliar se a relação de trabalho é adequada antes da efetivação do vínculo por prazo indeterminado.

## Prazo Máximo
- **Art. 445, parágrafo único, CLT**: prazo máximo de **90 dias**.
- Pode ser firmado em período único ou dividido em dois (ex.: 45 + 45 dias).

## Direitos Durante o Contrato
Mesmo sendo por prazo determinado, o trabalhador em experiência possui os mesmos direitos básicos:
- Registro em carteira (CTPS).
- Jornada de trabalho regular e pagamento de horas extras.
- FGTS com depósito mensal de 8%.
- Férias e 13º proporcionais.
- Benefícios previstos em convenção ou acordo coletivo.

## Rescisão Antecipada
- Se o contrato for rescindido **antes do término**, pode haver:
  - Pagamento da indenização de metade dos dias restantes (**art. 479, CLT**), quando a dispensa for pelo empregador sem justa causa.
  - Caso a rescisão seja pelo empregado, pode haver desconto equivalente (**art. 480, CLT**).
- Se o contrato terminar no prazo combinado, **não há aviso prévio**.

## Como é Realizado o Cálculo no Período de Experiência
Ao final ou na rescisão antecipada do contrato de experiência, o empregado tem direito às verbas proporcionais:

### Exemplo prático:
- Salário: **R$ 2.000,00**
- Tempo trabalhado: **60 dias**

O cálculo inclui:
- **Saldo de salário**: dias trabalhados no mês da rescisão.
- **Férias proporcionais**: (60 ÷ 12 meses = 0,166) × R$ 2.000 = **R$ 333,33** + 1/3 constitucional.
- **13º proporcional**: (60 ÷ 365 dias = 0,164) × R$ 2.000 = **R$ 328,77**.
- **FGTS**: 8% sobre o salário total do período.
- **Multa de 40% sobre o FGTS**: caso seja dispensa sem justa causa.

> Atenção: se a rescisão ocorrer antes do prazo final, o empregador deve ainda pagar metade da remuneração dos dias que restariam para concluir os 90 dias.

## Conversão em Prazo Indeterminado
Se o empregado continuar trabalhando após os 90 dias sem nova formalização, o contrato se converte automaticamente em prazo indeterminado (**art. 451, CLT**).

## Conclusão
O contrato de experiência de 90 dias é uma ferramenta essencial para empresas avaliarem candidatos, sem retirar do trabalhador os direitos mínimos garantidos pela legislação. A correta aplicação evita passivos trabalhistas e garante segurança jurídica às partes.
  `,
    date: '2026-01-12',
    readTime: '7 min',
    category: 'Contratos',
    tags: ['Contrato de Experiência', 'CLT', 'Cálculo Trabalhista', 'Direitos Trabalhistas'],
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